import { NextResponse } from "next/server";
export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const t = body?.type || "unknown";
    console.log("[ICE-METRIC]", t);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: true });
  }
}
