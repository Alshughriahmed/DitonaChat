"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function HeaderLite() {
  const pathname = usePathname();
  const onHome = pathname?.startsWith("/home");

  return (
    <header className="w-full sticky top-0 z-40 backdrop-blur bg-black/30 border-b border-white/10">
      <div className="mx-auto max-w-5xl px-4 py-3 flex items-center justify-between">
        <Link href="/home" className="font-extrabold text-white/90">
          Ditona
        </Link>
        <nav className="flex items-center gap-3">
          <span className="text-xs rounded border border-white/15 px-2 py-1 opacity-80">18+</span>
          <Link
            href="/api/auth/signin?callbackUrl=%2Fchat"
            className="text-sm hover:underline"
          >
            Login
          </Link>
          <Link
            href="/api/auth/signin?callbackUrl=%2Fchat"
            className="text-sm hover:underline"
          >
            Sign up
          </Link>
          {!onHome && (
            <Link
              href="/home"
              className="text-sm rounded-lg px-3 py-1.5 bg-white text-black font-semibold"
            >
              Start
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
