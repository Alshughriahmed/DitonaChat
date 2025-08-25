import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";
type Body = { destination?: string; code?: string };
const FLAG = (process.env.AGE_VERIF_METHOD || "cookie").toLowerCase();
export async function POST(req: Request) {
  if (FLAG !== "otp") return NextResponse.json({ ok:false, error:"OTP disabled (AGE_VERIF_METHOD!=otp)" }, { status: 501 });
  const { destination, code }: Body = await req.json().catch(() => ({} as Body));
  if (!destination || !code) return NextResponse.json({ ok:false, error:"Missing params" }, { status: 400 });
  (globalThis as any).__AGE_OTP ||= new Map<string,string>();
  const ok = (globalThis as any).__AGE_OTP.get(destination) === String(code);
  if (!ok) return NextResponse.json({ ok:false, error:"Invalid code" }, { status: 403 });
  const res = NextResponse.json({ ok:true });
  res.cookies.set('ageok', '1', { path: '/', maxAge: 60*60*24*365, sameSite: 'lax' });
  console.info("[AGE][OTP] confirmed (dev)");
  return res;
}
