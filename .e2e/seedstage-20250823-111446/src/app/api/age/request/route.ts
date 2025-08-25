import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(_req: Request) {
  if (process.env.AGE_VERIF_METHOD !== "otp") {
    return NextResponse.json({ ok: false, error: "DISABLED" }, { status: 501 });
  }
  // في الديف نولّد كود وهمي ونُعيده للسكرپتات الآلية
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const res = NextResponse.json({ ok: true, sent: true, code }, { status: 200 });
  res.headers.set("cache-control", "no-store, max-age=0");
  return res;
}
