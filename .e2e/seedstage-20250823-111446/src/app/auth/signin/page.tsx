"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";

export default function SignInPage(){
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  async function onSubmit(e: React.FormEvent){
    e.preventDefault();
    await signIn("email", { email, callbackUrl: "/account", redirect: false });
    setSent(true);
  }

  return (
    <main className="mx-auto max-w-md p-6 text-white">
      <h1 className="text-2xl font-semibold mb-4">Sign in</h1>
      <form onSubmit={onSubmit} className="space-y-3">
        <input
          type="email" required value={email}
          onChange={e=>setEmail(e.target.value)}
          placeholder="you@example.com"
          className="w-full px-3 py-2 rounded bg-white/10 border border-white/20 outline-none"
        />
        <button type="submit" className="px-4 py-2 rounded bg-sky-600 hover:bg-sky-500">
          Send magic link
        </button>
      </form>
      {sent && (
        <p className="mt-3 text-sm text-white/80">
          Development: احصل على رابط الدخول عبر
          {" "}
          <code className="bg-white/10 px-1 py-0.5 rounded">/api/auth/dev-magic?email={email}</code>
        </p>
      )}
      <div className="mt-6">
        <button
          onClick={()=>signIn("google", { callbackUrl: "/account" })}
          className="px-4 py-2 rounded bg-white text-black"
        >
          Continue with Google
        </button>
      </div>
    </main>
  );
}
