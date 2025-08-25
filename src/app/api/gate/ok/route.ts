import { NextResponse } from 'next/server';
export async function GET(req: Request) {
  const url = new URL(req.url);
  const back = url.searchParams.get('back') || '/chat';
  const res = NextResponse.redirect(new URL(back, url));
  res.cookies.set('ageok', '1', { path: '/', maxAge: 60*60*24*365, sameSite: 'lax' });
  return res;
}
