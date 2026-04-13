import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getAuthUser } from "@/lib/supabase/auth";

export async function GET() {
  const { userId, unauthorized } = await getAuthUser();
  if (unauthorized) return unauthorized;

  const supabase = createAdminClient();

  const [dealsRes, emailsRes, leadsRes] = await Promise.all([
    supabase.from("pipeline_deals").select("stage, value").eq("user_id", userId),
    supabase.from("emails_sent").select("status, sent_at").eq("user_id", userId),
    supabase.from("leads").select("id, created_at").eq("user_id", userId),
  ]);

  const deals = dealsRes.data ?? [];
  const emails = emailsRes.data ?? [];
  const leads = leadsRes.data ?? [];

  const closedRevenue = deals.filter(d => d.stage === "cerrado").reduce((a, d) => a + (d.value || 0), 0);
  const pipelineValue = deals.filter(d => d.stage !== "cerrado").reduce((a, d) => a + (d.value || 0), 0);

  const stageCounts = deals.reduce((acc: Record<string, number>, d) => {
    acc[d.stage] = (acc[d.stage] || 0) + 1;
    return acc;
  }, {});

  const opened = emails.filter(e => e.status === "opened" || e.status === "replied").length;
  const openRate = emails.length > 0 ? Math.round((opened / emails.length) * 100) : 0;

  return NextResponse.json({
    closedRevenue,
    pipelineValue,
    totalLeads: leads.length,
    totalDeals: deals.length,
    closedDeals: stageCounts["cerrado"] || 0,
    emailsSent: emails.length,
    openRate,
    stageCounts,
  });
}
