export async function xfetch(url: string, init?: RequestInit) {
  const r = await fetch(url, init);
  const ct = r.headers.get("content-type") || "";
  const body = ct.includes("application/json")
    ? await r.json().catch(() => null)
    : await r.text();
  return { ok: r.ok, status: r.status, body };
}
