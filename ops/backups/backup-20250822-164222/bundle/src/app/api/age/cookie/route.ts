import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";
export async function POST() {
  const res = NextResponse.json({ ok: true });
  // عمر سنة، SameSite=Lax لتعمل داخل نفس الأصل Replit
  res.cookies.set('ageok','1',{ path:'/', maxAge:60*60*24*365, sameSite:'lax' });
  return res;
}
