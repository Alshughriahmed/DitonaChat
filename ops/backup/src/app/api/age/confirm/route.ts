import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  // إذا لم تكن طريقة التحقق OTP مفعلة، نرجع 501
  if (process.env.AGE_VERIF_METHOD !== "otp") {
    return NextResponse.json({ ok: false, error: "DISABLED" }, { status: 501 });
  }

  try {
    const body = (await req.json().catch(() => ({}))) as { code?: string };
    if (!body?.code) {
      return NextResponse.json({ ok: false, error: "MISSING" }, { status: 400 });
    }

    const res = NextResponse.json({ ok: true }, { status: 200 });
    // لا تخزين + ضع الكوكي
    res.headers.set("cache-control", "no-store, max-age=0");
    res.headers.append(
      "set-cookie",
      "ageok=1; Path=/; Max-Age=31536000; SameSite=lax"
    );
    return res;
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: "HANDLER_ERROR" },
      { status: 500 }
    );
  }
}
