/** هل الوضع المجاني الشامل مفعّل؟ */
export function freeAll(): boolean {
  const v = (process.env.NEXT_PUBLIC_FREE_ALL || "").trim().toLowerCase();
  if (v === "1" || v === "true" || v === "yes") return true;
  const until = process.env.NEXT_PUBLIC_FREE_ALL_UNTIL;
  if (until) {
    const d = new Date(until);
    if (!Number.isNaN(d.getTime())) return Date.now() <= d.getTime();
  }
  return false;
}

/** يعيد تاريخ انتهاء الوضع المجاني (إن وُجد ويصلح) */
export function freeAllUntil(): Date | null {
  const until = process.env.NEXT_PUBLIC_FREE_ALL_UNTIL;
  if (!until) return null;
  const d = new Date(until);
  return Number.isNaN(d.getTime()) ? null : d;
}
