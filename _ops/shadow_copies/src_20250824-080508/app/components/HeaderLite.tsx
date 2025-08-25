'use client';
import Link from 'next/link';
export default function HeaderLite(){
  return (
    <header className="w-full flex items-center justify-end gap-4 p-3 border-b">
      <Link href="/api/auth/signin" className="underline">Login</Link>
      <Link href="/api/auth/signin?screen_hint=signup" className="underline">Sign up</Link>
    </header>
  );
}
