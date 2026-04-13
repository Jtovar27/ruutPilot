import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { createAdminClient } from "@/lib/supabase/admin";
import { getAuthUser } from "@/lib/supabase/auth";
import { getUserPlan, PLAN_LIMITS } from "@/lib/plans";

const client = new Anthropic();

export async function POST() {
  const { userId, email, unauthorized } = await getAuthUser();
  if (unauthorized) return unauthorized;

  // ── Plan limits ──
  const plan = await getUserPlan(userId!, email);
  if (!PLAN_LIMITS[plan].aiAdvisor) {
    return NextResponse.json(
      {
        error: "upgrade_required",
        message: "El Business Advisor AI requiere el plan Pro o Agencia.",
        plan,
      },
      { status: 402 }
    );
  }

  const supabase = createAdminClient();

  const [dealsRes, leadsRes, emailsRes] = await Promise.all([
    supabase.from("pipeline_deals").select("id, name, company, stage, value, created_at, notes, lead:leads(name, company)").eq("user_id", userId),
    supabase.from("leads").select("id, name, company, created_at").eq("user_id", userId),
    supabase.from("emails_sent").select("status, sent_at").eq("user_id", userId),
  ]);

  const deals = dealsRes.data ?? [];
  const leads = leadsRes.data ?? [];
  const emails = emailsRes.data ?? [];

  const stageCounts = deals.reduce((acc: Record<string, number>, d) => {
    acc[d.stage] = (acc[d.stage] || 0) + 1;
    return acc;
  }, {});

  const totalPipelineValue = deals
    .filter((d) => d.stage !== "cerrado")
    .reduce((a, d) => a + (d.value || 0), 0);

  const opened = emails.filter((e) => e.status === "opened" || e.status === "replied").length;
  const openRate = emails.length > 0 ? Math.round((opened / emails.length) * 100) : 0;

  const pipelineLines = deals
    .slice(0, 15)
    .map((d) => {
      const name = (d.lead as { name?: string } | null)?.name || d.name || d.company;
      const daysSince = Math.floor(
        (Date.now() - new Date(d.created_at).getTime()) / 86400000
      );
      return `- ${name} | etapa: ${d.stage} | valor: $${d.value} | ${daysSince}d en pipeline`;
    })
    .join("\n");

  const today = new Date().toLocaleDateString("es-CO", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  const prompt = `Eres un coach de ventas experto para freelancers y agencias latinoamericanas. Hoy es ${today}.

DATOS DEL NEGOCIO:
- Total leads: ${leads.length}
- Total deals: ${deals.length}
- Etapas: ${JSON.stringify(stageCounts)}
- Valor en pipeline activo: $${totalPipelineValue}
- Emails enviados: ${emails.length} | Tasa de apertura: ${openRate}%

PIPELINE DETALLADO:
${pipelineLines || "Sin deals activos aún."}

Analiza estos datos y genera acciones prioritarias concretas y accionables para hoy.

Responde ÚNICAMENTE con JSON válido, sin texto extra:
{
  "summary": "análisis del estado del negocio hoy (2-3 oraciones, menciona amounts específicos)",
  "urgentCount": <número de acciones de alta prioridad>,
  "estimatedValue": <valor total en pipeline activo como número>,
  "actions": [
    {
      "title": "acción concreta y específica (menciona nombres reales si hay datos)",
      "description": "por qué esta acción importa y qué impacto tiene (1-2 oraciones)",
      "impact": "Potencial: $X | o Mejora: X%",
      "priority": "alta|media|baja",
      "category": "Pipeline|Lead Gen|Email|Seguimiento"
    }
  ]
}

Genera 4-5 acciones ordenadas de mayor a menor prioridad.`;

  const message = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 1200,
    messages: [{ role: "user", content: prompt }],
  });

  const text = message.content[0].type === "text" ? message.content[0].text : "";
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    return NextResponse.json({ error: "AI parse error" }, { status: 500 });
  }

  let result;
  try {
    result = JSON.parse(jsonMatch[0]);
  } catch {
    return NextResponse.json({ error: "AI response parse error" }, { status: 500 });
  }
  return NextResponse.json(result);
}
