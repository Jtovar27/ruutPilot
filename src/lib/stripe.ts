import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-03-25.dahlia",
});

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
