import { NextRequest, NextResponse } from "next/server";
export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({ ok: true, hint: "POST { priceId } to create a Stripe Checkout subscription session." });
}

export async function POST(req: NextRequest) {
  try {
    const { default: Stripe } = await import("stripe");
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
      apiVersion: (process.env.STRIPE_API_VERSION || "2023-10-16") as any,
    });

    const body = await req.json().catch(() => ({} as any));
    const priceId: string =
      body?.priceId || process.env.STRIPE_PRICE_ID || "price_test_123";

    // أصل مطلق آمن للنجاح/الإلغاء
    const origin =
      req.nextUrl?.origin || process.env.APP_BASE_URL || "http://localhost:3000";

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${origin}/billing/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/billing/cancel`,
      allow_promotion_codes: true,
      automatic_tax: { enabled: false },
      client_reference_id: body?.userId || undefined,
    });

    return NextResponse.json({ ok: true, id: session.id, url: session.url });
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: String(e?.message || e) },
      { status: 500 }
    );
  }
}
