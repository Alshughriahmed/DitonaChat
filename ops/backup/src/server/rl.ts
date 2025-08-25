let modPromise: Promise<any> | null = null;
async function getRL() {
  const g: any = globalThis as any;
  if (g.__RL_MOD) return g.__RL_MOD;
  if (!modPromise) {
    modPromise = import("../../server/limit-middleware.js").then(m => (m as any).default ?? m);
  }
  g.__RL_MOD = await modPromise;
  return g.__RL_MOD;
}
export async function allow(event: string, key?: string): Promise<boolean> {
  try {
    const rl: any = await getRL();
    if (typeof rl?.allow === "function") return !!(await rl.allow({ event, key }));
    if (typeof rl?.check === "function") return !!(await rl.check({ event, key }));
    return true; // fallback: لا يوجد RL → اسمح
  } catch { return true; }
}
export async function bump(event: string): Promise<void> {
  try {
    const rl: any = await getRL();
    if (typeof rl?.bump === "function") rl.bump(event);
  } catch {}
}
