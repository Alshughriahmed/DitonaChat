import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const ageok = req.cookies.get('ageok')?.value === '1';
  const needGate = url.pathname.startsWith('/chat') || url.pathname.startsWith('/match');
  if (needGate && !ageok) {
    return NextResponse.redirect(new URL('/gate', url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/chat/:path*', '/match/:path*'],
};
