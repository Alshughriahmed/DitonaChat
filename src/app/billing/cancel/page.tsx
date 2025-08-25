'use client';
import { makeSocket, type SocketT } from '@/utils/socket';
export default function Cancel(){
  return (
    <main className="p-6 space-y-3">
      <h1 className="text-2xl font-bold">❌ Payment Canceled</h1>
      <a className="underline" href="/billing/test">Try again</a>
    </main>
  );
}
