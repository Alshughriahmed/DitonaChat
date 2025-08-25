import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";
type Body = { destination?: string };
const FLAG = (process.env.AGE_VERIF_METHOD || "cookie").toLowerCase();
export async function POST(req: Request) {
  if (FLAG !== "otp") return NextResponse.json({ ok:false, error:"OTP disabled (AGE_VERIF_METHOD!=otp)" }, { status: 501 });
  const { destination }: Body = await req.json().catch(() => ({} as Body));
  if (!destination) return NextResponse.json({ ok:false, error:"Missing destination" }, { status: 400 });
  (globalThis as any).__AGE_OTP ||= new Map<string,string>();
  const code = String(Math.floor(100000 + Math.random() * 900000));
  (globalThis as any).__AGE_OTP.set(destination, code);
  console.info("[AGE][OTP] issued (dev)"); // بدون PII
  return NextResponse.json({ ok:true, dev:true });
}
