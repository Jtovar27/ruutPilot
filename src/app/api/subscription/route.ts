import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/supabase/auth";
import { getUserPlan } from "@/lib/plans";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET() {
  const { userId, email, unauthorized } = await getAuthUser();
  if (unauthorized) return unauthorized;

  const plan = await getUserPlan(userId!, email);

  const supabase = createAdminClient();
  const { data: sub } = await supabase
    .from("subscriptions")
    .select("status, current_period_end, stripe_customer_id")
    .eq("user_id", userId!)
    .single();

  return NextResponse.json({
    plan,
    status: sub?.status ?? "free",
    periodEnd: sub?.current_period_end ?? null,
    hasCustomer: !!sub?.stripe_customer_id,
  });
}
