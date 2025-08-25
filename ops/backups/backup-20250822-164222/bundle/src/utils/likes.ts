"use client";

export type LikeMap = Record<string, true>;

const KEY = "likes";

/** يصنع معرفًا ثابتًا للطرف الحالي: يفضِّل id وإلا يُركِّب من الاسم+الدولة */
export function makePeerId(peer: { id?: string; name?: string; country?: string }): string {
  if (peer?.id) return String(peer.id);
  const name = (peer?.name || "").trim().toLowerCase();
  const cc = (peer?.country || "").trim().toUpperCase();
  return name || cc ? `peer:${name}:${cc}` : "peer:unknown";
}

export function getLikesMap(): LikeMap {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return {};
    const obj = JSON.parse(raw);
    return obj && typeof obj === "object" ? (obj as LikeMap) : {};
  } catch {
    return {};
  }
}

export function setLikesMap(m: LikeMap) {
  try { localStorage.setItem(KEY, JSON.stringify(m)); } catch {}
}

/** هل وضع المستخدم إعجابًا لهذا الطرف؟ */
export function hasLiked(peerId: string): boolean {
  const m = getLikesMap();
  return !!m[peerId];
}

/** يبدّل حالة الإعجاب محليًا؛ يعيد الحالة بعد التبديل */
export function toggleLike(peerId: string): boolean {
  const m = getLikesMap();
  if (m[peerId]) { delete m[peerId]; setLikesMap(m); return false; }
  m[peerId] = true; setLikesMap(m); return true;
}

/** يحسب العدد المعروض وفق الـMD: الأساس + (liked ? 1 : 0) */
export function displayLikes(base: number, peerId: string): number {
  return (Number.isFinite(base) ? base : 0) + (hasLiked(peerId) ? 1 : 0);
}

/** تمهيد وقائي: يضمن أن المفتاح موجود وبصيغة صحيحة */
export function ensureLikesMap() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) { localStorage.setItem(KEY, "{}"); return; }
    const obj = JSON.parse(raw);
    if (!obj || typeof obj !== "object") localStorage.setItem(KEY, "{}");
  } catch { localStorage.setItem(KEY, "{}"); }
}
