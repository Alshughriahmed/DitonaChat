
// src/lib/stripeConfig.ts (Final SoT)
import Stripe from "stripe";

type StripeMode = "test" | "live";
const envMode = ((process.env.STRIPE_MODE || (process.env.NODE_ENV === "production" ? "live" : "test")) as StripeMode);

export const STRIPE_MODE: StripeMode = envMode;

export const STRIPE_SECRET_KEY =
  envMode === "live"
    ? (process.env.STRIPE_SECRET_KEY || "")
    : (process.env.STRIPE_TEST_SECRET_KEY || process.env.STRIPE_SECRET_KEY || "");

export const STRIPE_PUBLISHABLE_KEY =
  process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY
  || process.env.STRIPE_PUBLISHABLE_KEY
  || process.env.STRIPE_TEST_PUBLISHABLE_KEY
  || process.env.STRIPE_PUBLIC_KEY
  || "";

export const PRICE = {
  PRO_WEEKLY: process.env.STRIPE_PRO_WEEKLY_ID || "",
  VIP_MONTHLY: process.env.STRIPE_VIP_MONTHLY_ID || "",
  ELITE_YEARLY: process.env.STRIPE_ELITE_YEARLY_ID || "",
  BOOST_ME_DAILY: process.env.STRIPE_BOOST_ME_DAILY_ID || "",
};

if (!STRIPE_SECRET_KEY) {
  throw new Error(`[stripe] Missing STRIPE_SECRET_KEY for mode=${envMode}`);
}

export const stripe = new Stripe(STRIPE_SECRET_KEY, { apiVersion: "2024-06-20" as any });
