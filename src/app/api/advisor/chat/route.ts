import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { createAdminClient } from "@/lib/supabase/admin";
import { getAuthUser } from "@/lib/supabase/auth";

const client = new Anthropic();

export async function POST(req: NextRequest) {
  const { userId, unauthorized } = await getAuthUser();
  if (unauthorized) return unauthorized;

  const { question } = await req.json();
  if (!question?.trim()) {
    return NextResponse.json({ error: "Question required" }, { status: 400 });
  }

  const supabase = createAdminClient();

  const [dealsRes, leadsRes] = await Promise.all([
    supabase.from("pipeline_deals").select("name, company, stage, value, notes, lead:leads(name, company, email, phone)").eq("user_id", userId),
    supabase.from("leads").select("name, company").eq("user_id", userId),
  ]);

  const deals = dealsRes.data ?? [];
  const leads = leadsRes.data ?? [];

  const pipelineLines = deals
    .slice(0, 20)
    .map((d) => {
      const name = (d.lead as { name?: string } | null)?.name || d.name || d.company;
      return `- ${name} | ${d.stage} | $${d.value}`;
    })
    .join("\n");

  const prompt = `Eres un coach de ventas experto. El usuario tiene este pipeline:

${pipelineLines || "Sin deals activos."}
Total leads: ${leads.length} | Total deals: ${deals.length}

Pregunta del usuario: "${question}"

Responde de forma concreta, accionable y en español. Máximo 5 puntos bullet. Si hay nombres de leads en el pipeline, mencionarlos específicamente cuando sea relevante.`;

  const message = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 600,
    messages: [{ role: "user", content: prompt }],
  });

  const answer = message.content[0].type === "text" ? message.content[0].text : "";
  return NextResponse.json({ answer });
}
