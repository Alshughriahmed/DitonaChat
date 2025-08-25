'use client';
import Link from 'next/link';

export default function HeaderLite() {
  return (
    <div className="fixed top-0 inset-x-0 z-[10000]">
      <header className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-end gap-4
                         bg-black/80 backdrop-blur text-white shadow-md border-b border-white/10">
        <nav className="flex items-center gap-5">
          <Link href="/api/auth/signin" className="underline font-medium">Login</Link>
          <Link href="/api/auth/signin?screen_hint=signup" className="underline font-medium">Sign up</Link>
        </nav>
      </header>
    </div>
  );
}
