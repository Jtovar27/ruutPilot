import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { createAdminClient } from "@/lib/supabase/admin";
import { getAuthUser } from "@/lib/supabase/auth";
import { getUserPlan, PLAN_LIMITS } from "@/lib/plans";

const client = new Anthropic();

export async function POST(req: NextRequest) {
  const { userId, email, unauthorized } = await getAuthUser();
  if (unauthorized) return unauthorized;

  // ── Plan limits ──
  const plan = await getUserPlan(userId!, email);
  if (!PLAN_LIMITS[plan].aiCallPrep) {
    return NextResponse.json(
      {
        error: "upgrade_required",
        message: "Call Prep AI requiere el plan Pro o Agencia.",
        plan,
      },
      { status: 402 }
    );
  }

  const { deal_id } = await req.json();
  if (!deal_id) return NextResponse.json({ error: "deal_id required" }, { status: 400 });

  const supabase = createAdminClient();

  const { data: deal, error } = await supabase
    .from("pipeline_deals")
    .select("*, lead:leads(*)")
    .eq("id", deal_id)
    .eq("user_id", userId)
    .single();

  if (error || !deal) {
    return NextResponse.json({ error: "Deal not found" }, { status: 404 });
  }

  const lead = deal.lead as Record<string, unknown> | null;

  const daysSince = Math.floor(
    (Date.now() - new Date(deal.created_at).getTime()) / 86400000
  );

  const prompt = `Eres un experto coach de ventas para freelancers y agencias latinoamericanas.
Prepara un briefing completo para una llamada de ventas con este prospecto.

DATOS DEL PROSPECTO:
- Nombre: ${lead?.name || deal.name}
- Empresa: ${lead?.company || deal.company}
- Industria/Categoría: ${lead?.category || "No especificada"}
- Email: ${lead?.email || "No disponible"}
- Teléfono: ${lead?.phone || "No disponible"}
- Dirección: ${lead?.address || "No disponible"}
- Rating Google: ${lead?.rating || "N/A"} (${lead?.reviews || 0} reseñas)
- Sitio web: ${lead?.website || "No disponible"}

ESTADO EN PIPELINE:
- Etapa actual: ${deal.stage}
- Valor potencial: $${deal.value}
- Días en pipeline: ${daysSince}
- Notas previas: ${deal.notes || "Sin notas"}

Responde ÚNICAMENTE con JSON válido, sin texto extra:
{
  "summary": "resumen del prospecto y su negocio (2-3 oraciones, basado en la industria y datos disponibles)",
  "callGoal": "objetivo específico, concreto y alcanzable para esta llamada puntual",
  "objections": [
    "objeción esperada 1 basada en la industria y etapa",
    "objeción esperada 2",
    "objeción esperada 3"
  ],
  "talkingPoints": [
    "talking point 1 específico para este prospecto",
    "talking point 2",
    "talking point 3",
    "talking point 4"
  ],
  "openQuestions": [
    "pregunta estratégica 1 para descubrir necesidades",
    "pregunta estratégica 2"
  ]
}`;

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

  let briefing;
  try {
    briefing = JSON.parse(jsonMatch[0]);
  } catch {
    return NextResponse.json({ error: "AI response parse error" }, { status: 500 });
  }

  return NextResponse.json({
    ...briefing,
    dealId: deal.id,
    leadName: (lead?.name as string) || deal.name,
    leadCompany: (lead?.company as string) || deal.company,
    stage: deal.stage,
    value: deal.value,
    daysSince,
  });
}
