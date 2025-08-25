// DitonaChat — Home (Server Component)
import Link from "next/link";

export default function HomePage() {
  const year = new Date().getFullYear();
  return (
    <main className="min-h-[100dvh] flex flex-col bg-black text-neutral-100">
      {/* HERO */}
      <section className="flex-1 grid place-items-center p-6 text-center">
        <div className="max-w-xl space-y-6">
          <div className="inline-flex items-center gap-2 text-xs md:text-sm rounded-full px-3 py-1 border border-neutral-700 bg-neutral-800/50">
            <span>🔞</span><span>18+</span><span className="opacity-70">Adults only</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight">
            DitonaChat — فيديو عشوائي (+18) بسرعة لمسة
          </h1>
          <p className="text-neutral-400">
            تطابق فوري، إيماءات للتنقّل (أفقي ≥ 80px / رأسي ≥ 50px)، ومُحدّدات الدولة/الجنس من أعلى اليمين.
          </p>
          <div className="flex items-center justify-center gap-3">
            {/* CTA يمرّ عبر بوابة +18 ثم يعيد التوجيه */}
            <a
              href="/api/age/allow"
              className="px-5 py-3 rounded-xl bg-white text-black font-semibold hover:opacity-90 focus:outline-none focus:ring"
              aria-label="Start chat now"
            >
              Start Chat
            </a>
            <Link
              href="/settings"
              className="px-5 py-3 rounded-xl border border-neutral-700 hover:bg-neutral-800"
              aria-label="Open settings"
            >
              Settings
            </Link>
          </div>
          <p className="text-xs text-neutral-500">
            بالاستمرار أنت توافق على{" "}
            <Link className="underline hover:no-underline" href="/legal/terms">الشروط</Link>
            {" "}و{" "}
            <Link className="underline hover:no-underline" href="/legal/privacy">الخصوصية</Link>.
          </p>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" className="py-10 border-t border-neutral-800/70">
        <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-6 p-6">
          <div className="rounded-2xl border border-neutral-800 p-5 bg-neutral-900/30">
            <h3 className="font-semibold mb-2">مطابقة فورية</h3>
            <p className="text-neutral-400 text-sm">ادخل وابدأ—لا تسجيل مطلوب الآن. اضغط Next/Prev للتبديل.</p>
          </div>
          <div className="rounded-2xl border border-neutral-800 p-5 bg-neutral-900/30">
            <h3 className="font-semibold mb-2">إيماءات سهلة</h3>
            <p className="text-neutral-400 text-sm">أفقي ≥ 80px → Next/Prev. رأسي ≥ 50px → latest/history.</p>
          </div>
          <div className="rounded-2xl border border-neutral-800 p-5 bg-neutral-900/30">
            <h3 className="font-semibold mb-2">اختيار الدولة/الجنس</h3>
            <p className="text-neutral-400 text-sm">🌍 و“Choose Gender” من أعلى اليمين—مع حارس mount لمنع mismatch.</p>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-8 border-t border-neutral-800/70 text-center text-sm text-neutral-500">
        <div className="space-x-4">
          <Link href="/legal/terms" className="underline hover:no-underline">Terms</Link>
          <Link href="/legal/privacy" className="underline hover:no-underline">Privacy</Link>
          <a href="mailto:info@ditonachat.com" className="underline hover:no-underline">Contact</a>
        </div>
        <div className="mt-2">© {year} DitonaChat</div>
      </footer>
    </main>
  );
}
