export const runtime = 'nodejs';
export const revalidate = 0;
export const fetchCache = 'default-no-store';
export const dynamic = 'force-dynamic';
import type Stripe from "stripe";
import { NextResponse } from 'next/server';
import { getStripe } from '@/lib/stripeClient';
import { STRIPE_MODE } from '@/lib/stripeConfig';

export async function GET() {
  const stripe = getStripe();
  const prices = await stripe.prices.list({ limit: 20, expand: ['data.product'] });
  const data = prices.data.map(p => {
    const productName = 
      typeof p.product === "object" && p.product
        ? ("deleted" in p.product && p.product.deleted
            ? null
            : (p.product as Stripe.Product).name ?? null)
        : null;
    
    return {
      id: p.id,
      nickname: p.nickname ?? null,
      currency: p.currency,
      amount: p.unit_amount ?? null,
      recurring: p.recurring ? p.recurring.interval : null,
      product: productName,
    };
  });
  return NextResponse.json({ ok: true, mode: STRIPE_MODE, count: data.length, data });
}
