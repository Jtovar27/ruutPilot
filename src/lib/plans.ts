import { createAdminClient } from "./supabase/admin";

export const PLAN_LIMITS = {
  free: {
    searchesPerMonth: 3,
    pipelineDeals: 15,
    emailsPerMonth: 0,
    aiAdvisor: false,
    aiCallPrep: false,
    leadsPerSearch: 10,
    csvExport: false,
    teamMembers: 1,
  },
  pro: {
    searchesPerMonth: 30,
    pipelineDeals: Infinity,
    emailsPerMonth: 300,
    aiAdvisor: true,
    aiCallPrep: true,
    leadsPerSearch: 30,
    csvExport: true,
    teamMembers: 1,
  },
  agency: {
    searchesPerMonth: Infinity,
    pipelineDeals: Infinity,
    emailsPerMonth: Infinity,
    aiAdvisor: true,
    aiCallPrep: true,
    leadsPerSearch: 75,
    csvExport: true,
    teamMembers: 5,
  },
} as const;

export type Plan = keyof typeof PLAN_LIMITS;

// Developer accounts — always get full Agency access regardless of subscription
const ADMIN_EMAILS = ["ruutdevllc@gmail.com"];

export async function getUserPlan(userId: string, email?: string | null): Promise<Plan> {
  if (email && ADMIN_EMAILS.includes(email)) return "agency";

  const supabase = createAdminClient();
  const { data } = await supabase
    .from("subscriptions")
    .select("plan, status")
    .eq("user_id", userId)
    .single();

  if (!data || !["active", "trialing"].includes(data.status)) return "free";
  return (data.plan as Plan) ?? "free";
}

export async function getMonthlySearchCount(userId: string): Promise<number> {
  const supabase = createAdminClient();
  const now = new Date();
  const startOfMonth = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));

  const { count } = await supabase
    .from("search_logs")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId)
    .gte("created_at", startOfMonth.toISOString());

  return count ?? 0;
}

export async function logSearch(userId: string, query: string, location: string) {
  const supabase = createAdminClient();
  await supabase.from("search_logs").insert({ user_id: userId, query, location });
}

export async function getPipelineCount(userId: string): Promise<number> {
  const supabase = createAdminClient();
  const { count } = await supabase
    .from("pipeline_deals")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId)
    .neq("stage", "cerrado");

  return count ?? 0;
}
