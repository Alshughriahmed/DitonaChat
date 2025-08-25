export const runtime = "nodejs";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const rl = require("../../../../../server/limit-middleware");
    const stats = rl && typeof rl.getStats === "function" ? rl.getStats() : null;
    if (!stats) {
      return NextResponse.json({ ok: false, error: "getStats unavailable" }, { status: 500 });
    }
    // تصفير العدّادات (getStats يُعيد مرجع STATS)
    stats.allowed = 0;
    stats.dropped = 0;
    stats.byEvent = {};
    return NextResponse.json({ ok: true, reset: true });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: String(e?.message || e) }, { status: 500 });
  }
}
