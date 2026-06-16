import Stripe from "stripe";

let stripeClient: Stripe | null = null;

export function getStripe() {
  if (stripeClient) return stripeClient;

  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    throw new Error("STRIPE_SECRET_KEY is not configured.");
  }

  stripeClient = new Stripe(secretKey, {
    apiVersion: "2026-03-25.dahlia",
  });
  return stripeClient;
}

export const PLANS = {
  pro: {
    name: "Pro",
    priceId: process.env.STRIPE_PRO_PRICE_ID!,
    amount: 2900, // $29 USD en centavos
  },
  agency: {
    name: "Agencia",
    priceId: process.env.STRIPE_AGENCY_PRICE_ID!,
    amount: 6900, // $69 USD en centavos
  },
} as const;

export type PlanKey = keyof typeof PLANS;
