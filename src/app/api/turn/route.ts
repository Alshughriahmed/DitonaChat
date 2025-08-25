import { NextResponse } from "next/server";

// Env contract (all optional for local):
// STUN_URLS="stun:stun.l.google.com:19302,stun:global.stun.twilio.com:3478"
// TURN_URLS="turn:turn.example.com:3478,turns:turn.example.com:5349"
// TURN_USERNAME="user"
// TURN_CREDENTIAL="pass"
// TURN_TTL="300"  // seconds
export async function GET() {
  const ts = Date.now();
  const ttl = Number.parseInt(process.env.TURN_TTL || "300", 10);

  const stunUrls = (process.env.STUN_URLS || "stun:stun.l.google.com:19302")
    .split(",").map(s => s.trim()).filter(Boolean);

  const iceServers: Array<any> = [{ urls: stunUrls }];

  const tUrlsRaw = process.env.TURN_URLS || process.env.TURN_URL || "";
  const tUser = process.env.TURN_USERNAME || process.env.TURN_USER || "";
  const tCred = process.env.TURN_CREDENTIAL || process.env.TURN_PASSWORD || "";

  let source = "fallback";
  if (tUrlsRaw && tUser && tCred) {
    const turnUrls = tUrlsRaw.split(",").map(s => s.trim()).filter(Boolean);
    iceServers.push({ urls: turnUrls, username: tUser, credential: tCred });
    source = "env";
  }

  return NextResponse.json(
    { iceServers, ts, ttl, source },
    {
      headers: {
        // small client/proxy cache; do not cache for too long
        "Cache-Control": `public, max-age=${Math.min(ttl, 60)}, s-maxage=${ttl}`
      }
    }
  );
}
