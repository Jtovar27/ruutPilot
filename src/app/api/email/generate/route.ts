import { NextRequest, NextResponse } from "next/server";
import { groqChat } from "@/lib/groq";
import { getAuthUser } from "@/lib/supabase/auth";
import { getUserPlan, PLAN_LIMITS } from "@/lib/plans";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(req: NextRequest) {
  const { userId, email, unauthorized } = await getAuthUser();
  if (unauthorized) return unauthorized;

  const plan = await getUserPlan(userId!, email);
  if (!PLAN_LIMITS[plan].aiAdvisor) {
    return NextResponse.json(
      { error: "upgrade_required", message: "La generación de emails con IA requiere el plan Pro o Agencia." },
      { status: 402 }
    );
  }

  const { template, leadName, leadCompany, leadCategory } = await req.json();
  if (!template) return NextResponse.json({ error: "template required" }, { status: 400 });

  // Get business context from user settings
  const supabase = createAdminClient();
  const { data: { user } } = await supabase.auth.admin.getUserById(userId!);
  const meta = (user?.user_metadata ?? {}) as Record<string, string>;
  const businessName = meta.business_name || "mi agencia";
  const serviceType = meta.service_type || "desarrollo web";
  const pricePerProject = meta.price_per_project || "1500";
  const currency = meta.currency || "USD";

  const SERVICE_LABELS: Record<string, string> = {
    web_dev: "desarrollo web",
    social_media: "social media y community management",
    seo: "SEO y posicionamiento web",
    marketing: "marketing digital",
    design: "diseño gráfico y branding",
    copywriting: "copywriting y contenido",
    ads: "publicidad pagada (Meta/Google Ads)",
    other: "servicios digitales",
  };
  const serviceLabel = SERVICE_LABELS[serviceType] || serviceType;

  const TEMPLATE_PROMPTS: Record<string, string> = {
    "Email frío B2B": `Escribe un email frío de ventas B2B para un negocio local. El objetivo es conseguir una llamada de 15 minutos. Sé directo, conciso y personalizado.`,
    "Follow-up post llamada": `Escribe un email de follow-up después de una llamada de descubrimiento. Resume los puntos clave discutidos y da el siguiente paso concreto.`,
    "Propuesta de valor": `Escribe un email presentando una propuesta de valor para un prospecto que mostró interés. Incluye beneficios concretos y un llamado a la acción claro.`,
    "Re-activar lead frío": `Escribe un email para re-activar un lead que no ha respondido en más de 90 días. Menciona un cambio o novedad relevante y ofrece valor inmediato.`,
  };

  const templatePrompt = TEMPLATE_PROMPTS[template] || `Escribe un email profesional de tipo "${template}".`;

  const prompt = `Eres un copywriter experto en ventas para agencias y freelancers latinoamericanos.

CONTEXTO DE QUIEN ENVÍA:
- Negocio: ${businessName}
- Servicio: ${serviceLabel}
- Precio promedio: ${currency} ${pricePerProject} por proyecto

PROSPECTO:
- Nombre: ${leadName || "[Nombre del prospecto]"}
- Empresa: ${leadCompany || "[Nombre del negocio]"}
- Industria: ${leadCategory || "negocio local"}

TAREA: ${templatePrompt}

REGLAS:
- Escribe en español latino, tono profesional pero cercano
- Máximo 150 palabras en el cuerpo del email
- Incluye un CTA concreto y específico (no genérico)
- Personaliza con los datos del prospecto cuando estén disponibles
- NO uses placeholders como [Tu nombre] — usa el nombre del negocio real

Responde ÚNICAMENTE con JSON válido:
{
  "subject": "asunto del email (max 60 chars, sin comillas al inicio)",
  "body": "cuerpo completo del email listo para enviar"
}`;

  const text = await groqChat(prompt, { maxTokens: 800, json: true });
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
