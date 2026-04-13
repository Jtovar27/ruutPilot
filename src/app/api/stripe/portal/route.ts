import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { getAuthUser } from "@/lib/supabase/auth";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST() {
  const { userId, unauthorized } = await getAuthUser();
  if (unauthorized) return unauthorized;

  const supabase = createAdminClient();
  const { data: sub } = await supabase
    .from("subscriptions")
    .select("stripe_customer_id")
    .eq("user_id", userId)
    .single();

  if (!sub?.stripe_customer_id) {
    return NextResponse.json({ error: "No subscription found" }, { status: 404 });
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  const session = await stripe.billingPortal.sessions.create({
    customer: sub.stripe_customer_id,
    return_url: `${appUrl}/dashboard`,
  });

  return NextResponse.json({ url: session.url });
}
