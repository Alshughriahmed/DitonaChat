import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";
export async function GET(req: Request) {
  if (process.env.EMAIL_DEV_ECHO_LINK !== "1")
    return NextResponse.json({ ok:false, error:"DISABLED" }, { status:403 });
  const urlObj = new URL(req.url);
  const email = urlObj.searchParams.get("email") || "";
  const store: any = (globalThis as any).__MAGIC_STORE || {};
  return NextResponse.json({ ok:true, email, url: store[email] || null });
}
