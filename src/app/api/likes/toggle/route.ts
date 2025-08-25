import { NextResponse } from "next/server";

/**
 * POST { peerId: string, like?: boolean }
 * - يُخزّن تفضيل اللايك في Cookie لمدة سنة لكل peerId.
 * - يعيد: { ok:true, liked:boolean }
 */
export async function POST(request: Request) {
  let body: any = {};
  try { body = await request.json(); } catch {}
  const peerId = (body?.peerId ?? "").toString().trim();
  if (!peerId) {
    return NextResponse.json({ ok: false, error: "peerId required" }, { status: 400 });
  }
  const key = `liked_${encodeURIComponent(peerId)}`;
  const cookie = request.headers.get("cookie") || "";
  const prevLiked = new RegExp(`(?:^|; )${key}=1(?:;|$)`).test(cookie);
  const liked = typeof body?.like === "boolean" ? body.like : !prevLiked;

  const res = NextResponse.json({ ok: true, liked });
  res.cookies.set(key, liked ? "1" : "0", {
    path: "/",
    maxAge: 60 * 60 * 24 * 365, // سنة
    sameSite: "lax",
  });
  return res;
}
