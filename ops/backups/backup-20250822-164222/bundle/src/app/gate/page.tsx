import './hide-legacy-header.css';
export const dynamic = "force-static";

import Link from "next/link";
import NextDynamic from "next/dynamic";

const AgeGate = NextDynamic(() => import("./AgeGate.client"), { ssr: false });

export default function GatePage() {
  return (
    <main className="min-h-[60vh] relative flex items-center justify-center p-6">
      {/* Header strip (top-right) */}
      <div className="absolute top-4 right-4 flex items-center gap-3 text-white">
        <span className="inline-block text-xs px-2 py-1 rounded bg-red-600">18+</span>
        <Link className="underline text-sm" href="/api/auth/signin">Login</Link>
        <Link className="underline text-sm" href="/api/auth/signin?prompt=select_account">Sign up</Link>
      </div>

      <div className="bg-black/40 backdrop-blur rounded-2xl p-6 w-full max-w-md border border-white/10 text-white text-center">
        <h1 className="text-3xl font-bold mb-2">دخول 18+</h1>
        <p className="text-sm opacity-80 mb-4">Please confirm you are 18+ to continue to chat.</p>

        {/* Client gate */}
        <AgeGate />

        {/* SSR fallback so text is present even before hydration */}
        <noscript>
          <p className="mt-3"><a href="/home" className="px-4 py-2 rounded-lg font-semibold bg-gray-600 opacity-80">Start Video Chat</a></p>
        </noscript>

        <p className="mt-4 text-xs opacity-70">
          <Link href="/legal/terms">Terms</Link> · <Link href="/legal/privacy">Privacy</Link>
        </p>
      </div>
    </main>
  );
}
