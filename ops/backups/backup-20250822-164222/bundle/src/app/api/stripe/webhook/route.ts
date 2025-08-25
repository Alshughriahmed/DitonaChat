import { NextResponse } from "next/server";

export async function GET() {
  return new NextResponse("Method Not Allowed", { status: 405 });
}

export async function POST(_req: Request) {
  // stub only; real processing handled elsewhere
  return NextResponse.json({ ok: true });
}
