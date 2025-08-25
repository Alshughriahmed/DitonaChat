import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  // نترك الـ SDK يختار نسخة الحساب افتراضيًا، مع إمكانية override عبر ENV
  apiVersion: (process.env.STRIPE_API_VERSION as any) ?? undefined,
});

export const publicUrl = (path = "") => {
  const base = process.env.NEXT_PUBLIC_BASE_URL || `http://localhost:${process.env.PORT || 3000}`;
  return base + path;
};

export default stripe;
