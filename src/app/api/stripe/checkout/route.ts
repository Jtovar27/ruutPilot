import { NextRequest, NextResponse } from "next/server";
import { getStripe, PLANS, PlanKey } from "@/lib/stripe";
import { getAuthUser } from "@/lib/supabase/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  const { userId, unauthorized } = await getAuthUser();
  if (unauthorized) return unauthorized;

  const { plan } = await req.json() as { plan: PlanKey };
  if (!PLANS[plan]) return NextResponse.json({ error: "Invalid plan" }, { status: 400 });

  const supabase = createAdminClient();

  // Look up existing stripe_customer_id in subscriptions table
  const { data: sub } = await supabase
    .from("subscriptions")
    .select("stripe_customer_id")
    .eq("user_id", userId)
    .single();

  let customerId = sub?.stripe_customer_id;

  if (!customerId) {
    // Get email from auth
    const authClient = await createClient();
    const { data: { user } } = await authClient.auth.getUser();

    const customer = await getStripe().customers.create({
      email: user?.email,
      metadata: { supabase_user_id: userId! },
    });
    customerId = customer.id;

    // Upsert into subscriptions so we have the customer ID
    await supabase.from("subscriptions").upsert(
      { user_id: userId, stripe_customer_id: customerId, status: "inactive", plan: "free" },
      { onConflict: "user_id" }
    );
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  const session = await getStripe().checkout.sessions.create({
    customer: customerId,
    mode: "subscription",
    payment_method_types: ["card"],
    line_items: [{ price: PLANS[plan].priceId, quantity: 1 }],
    success_url: `${appUrl}/dashboard?upgraded=1`,
    cancel_url: `${appUrl}/pricing?cancelled=1`,
    subscription_data: { metadata: { supabase_user_id: userId!, plan } },
    allow_promotion_codes: true,
    billing_address_collection: "auto",
  });

  return NextResponse.json({ url: session.url });
}
