export const runtime = "nodejs";
import { NextRequest, NextResponse } from "next/server";
import { adminGuard } from "@/utils/adminGuard";

export async function GET(req: NextRequest) {
  // @ts-ignore (using Node response)
  const res: any = { statusCode: 200, end: (b?: any) => b };
  // @ts-ignore
  if (!adminGuard(req, res)) return new Response("", { status: 404 });
  try {
    // Relative to this file: src/app/api/ratelimit/route.ts -> project root -> server/limit-middleware.js
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const rl = require("../../../../server/limit-middleware");
    const stats = rl && typeof rl.getStats === "function" ? rl.getStats() : null;
    return NextResponse.json({ ok: true, stats });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: String(e?.message || e) }, { status: 500 });
  }
}
