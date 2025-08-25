import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
export async function GET(req: Request) {
  const url = new URL(req.url);
  const res = NextResponse.redirect(new URL('/chat', url));
  res.cookies.set('ageok', '1', { path: '/', maxAge: 60*60*24*365, sameSite: 'lax' });
  return res;
}
