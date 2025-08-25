import { NextResponse } from "next/server";
export async function GET(req: Request) {
  const res = NextResponse.redirect(new URL('/chat', req.url));
  res.cookies.set('ageok','1',{ path:'/', maxAge:60*60*24*365, sameSite:'lax' });
  return res;
}
