import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getAuthUser } from "@/lib/supabase/auth";
import { getUserPlan, getPipelineCount, PLAN_LIMITS } from "@/lib/plans";

export async function GET() {
  const { userId, unauthorized } = await getAuthUser();
  if (unauthorized) return unauthorized;

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("pipeline_deals")
    .select("*, lead:leads(name, company, email, phone)")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const { userId, email, unauthorized } = await getAuthUser();
  if (unauthorized) return unauthorized;

  // ── Plan limits ──
  const [plan, dealCount] = await Promise.all([
    getUserPlan(userId!, email),
    getPipelineCount(userId!),
  ]);

  const limit = PLAN_LIMITS[plan].pipelineDeals;
  if (isFinite(limit) && dealCount >= limit) {
    const planLabel = plan === "free" ? "gratuito" : plan;
    return NextResponse.json(
      {
        error: "limit_reached",
        message: `Alcanzaste el límite de ${limit} deals activos en el plan ${planLabel}.`,
        dealsUsed: dealCount,
        dealsLimit: limit,
        plan,
      },
      { status: 402 }
    );
  }

  const supabase = createAdminClient();
  const body = await req.json();

  const { data, error } = await supabase
    .from("pipeline_deals")
    .insert({ ...body, user_id: userId, stage: body.stage ?? "prospecto" })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}
