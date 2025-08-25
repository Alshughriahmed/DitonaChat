'use client';
import { makeSocket, type SocketT } from '@/utils/socket';
export default function Success(){
  return (
    <main className="p-6 space-y-3">
      <h1 className="text-2xl font-bold">✅ Payment Success</h1>
      <p>تم الدفع بنجاح (Test). راجع /account لتحديث حالة الاشتراك.</p>
      <a className="underline" href="/account">Go to Account</a>
    </main>
  );
}
