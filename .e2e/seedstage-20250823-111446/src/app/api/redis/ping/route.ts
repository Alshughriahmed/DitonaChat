import { NextResponse } from "next/server";
import { redis } from "@/lib/redis";
export async function GET() {
  try {
    const ping = await redis.ping();
    await redis.set("__probe","ok",{EX:30} as any);
    const val = await redis.get("__probe");
    return NextResponse.json({ ok:true, ping, val });
  } catch (e:any) {
    return NextResponse.json({ ok:false, error: e?.message||String(e) }, { status: 500 });
  }
}
