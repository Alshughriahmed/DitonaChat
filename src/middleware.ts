import { NextResponse, NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const needGate = url.pathname.startsWith('/chat') || url.pathname.startsWith('/match');
  const ageok = req.cookies.get('ageok')?.value;
  const bypass = process.env.NEXT_PUBLIC_AGE_BYPASS === '1' || process.env.AGE_BYPASS === '1';

  if (needGate) {
    if (bypass) {
      // أثناء التطوير: نضمن وجود الكوكي ثم نُكمل
      const res = NextResponse.next();
      res.cookies.set({
        name: 'ageok',
        value: '1',
        path: '/',
        maxAge: 60*60*24*365,
        sameSite: 'lax',
      });
      return res;
    }
    if (!ageok) {
      return NextResponse.redirect(new URL('/gate', req.url));
    }
  }
  return NextResponse.next();
}
