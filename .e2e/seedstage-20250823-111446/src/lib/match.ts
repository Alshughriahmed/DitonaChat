export type MatchState = 'idle' | 'queued' | 'paired' | 'error';
export type MatchStatus = { status: MatchState; peerId?: string; roomId?: string; msg?: string };

async function api<T=any>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(path, {
    headers: { 'content-type': 'application/json' },
    cache: 'no-store',
    ...init,
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json() as Promise<T>;
}

export function enqueue(payload: Record<string, any> = {}) {
  return api('/api/match/enqueue', { method: 'POST', body: JSON.stringify(payload) });
}
export function cancel() {
  return api('/api/match/cancel', { method: 'POST', body: JSON.stringify({}) });
}
export function getStatus() {
  return api<MatchStatus>('/api/match/status');
}
