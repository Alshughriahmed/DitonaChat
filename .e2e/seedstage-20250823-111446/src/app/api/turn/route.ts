import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

function parseCsv(s: string): string[] {
  return (s || "").split(",").map(v => v.trim()).filter(Boolean);
}

export async function GET() {
  // STUN: اختياري عبر STUN_URLS، وإلا Google
  const stunUrls = parseCsv(process.env.STUN_URLS || "");
  const stun = stunUrls.length ? stunUrls : ["stun:stun.l.google.com:19302"];

  // TURN عبر ENV
  const turnUrls = parseCsv(process.env.TURN_URLS || "");
  const username = process.env.TURN_USERNAME || "";
  const credential = process.env.TURN_CREDENTIAL || "";

  const iceServers: any[] = [...stun.map(urls => ({ urls }))];

  if (turnUrls.length) {
    const turnEntry: any = { urls: turnUrls };
    if (username) turnEntry.username = username;
    if (credential) turnEntry.credential = credential;
    iceServers.push(turnEntry);
  }

  const body: any = { iceServers, ts: Date.now() };

  // Debug آمن في التطوير فقط (لا يطبع الأسرار)
  if (process.env.NODE_ENV !== "production" && process.env.TURN_DEBUG === "1") {
    body.debug = {
      hasTURN: turnUrls.length > 0,
      turnUrlsCount: turnUrls.length,
      hasUser: !!username,
      hasCred: !!credential,
      stunCount: stun.length
    };
  }

  // تأكد من عدم التخزين
  return new NextResponse(JSON.stringify(body), {
    status: 200,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store, max-age=0"
    }
  });
}
