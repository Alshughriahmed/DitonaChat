/**
 * VIP gating – single source of truth
 * - freeAllActive(): يفتح كل مزايا VIP إن كان NEXT_PUBLIC_VIP_FREE_ALL=1 أو تاريخ YYYY-MM-DD مستقبلي.
 * - guardVip(onAllowed, onBlocked, isVip?): يسمح لو freeAllActive() أو isVip=true؛ وإلا يستدعي onBlocked.
 */
export function freeAllActive(): boolean {
  const v = process.env.NEXT_PUBLIC_VIP_FREE_ALL ?? '0';
  if (v === '1' || (v as string).toLowerCase?.() === 'true') return true;
  if (/^\d{4}-\d{2}-\d{2}$/.test(v)) {
    try { return Date.now() <= Date.parse(v + 'T23:59:59Z'); } catch { return false; }
  }
  return false;
}

// إبقاء vipOpen للتوافق الخلفي
export const vipOpen = freeAllActive();

export function guardVip<T>(
  onAllowed: () => T,
  onBlocked: () => T,
  isVip?: boolean | (() => boolean)
): T {
  const vip = typeof isVip === 'function' ? !!(isVip as () => boolean)() : !!isVip;
  return (freeAllActive() || vip) ? onAllowed() : onBlocked();
}
