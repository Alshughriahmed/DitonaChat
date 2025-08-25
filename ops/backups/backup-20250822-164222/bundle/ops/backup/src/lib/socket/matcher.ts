// @ts-nocheck
"use client"
import type { SocketT } from '@/utils/socket';
import type { Server, Socket } from "socket.io";

type Waiting = { id: string; ts: number };
const g = globalThis as any;

export function attachMatcher(io: Server) {
  if (!io) return;
  if (g.__ditonaMatcherAttached) return;
  g.__ditonaMatcherAttached = true;

  const waiting: Waiting[] = [];
  const buddy = new Map<string,string>(); // socket.id -> partner.id

  const pickPeer = (me: string): string | null => {
    while (waiting.length && !io.sockets.sockets.get(waiting[0].id)) waiting.shift();
    const cand = waiting.find(w => w.id !== me);
    if (!cand) return null;
    const idx = waiting.findIndex(w => w.id === cand.id);
    if (idx >= 0) waiting.splice(idx,1);
    return cand.id;
  };

  io.on("connection", (s: SocketT) => {
    console.log("[io] connect", s.id);
    s.data.joined = false;

    s.on("queue:join", () => {
      console.log("[queue:join]", s.id, "waiting=", waiting.length);
      if (s.data.joined) return;
      const other = pickPeer(s.id);
      if (other) {
        buddy.set(s.id, other);
        buddy.set(other, s.id);
        const room = `r-${Date.now()}-${Math.random().toString(36).slice(2,7)}`;
        s.join(room); io.sockets.sockets.get(other)?.join(room);
        s.emit("paired", { room, role: "caller", peer: other });
        io.sockets.sockets.get(other)?.emit("paired", { room, role: "callee", peer: s.id });
        s.data.joined = true; (io.sockets.sockets.get(other) as any).data.joined = true;
        console.log("[pair]", s.id, "<>", other, "room=", room);
      } else {
        waiting.push({ id: s.id, ts: Date.now() });
        s.emit("queued", { size: waiting.length });
      }
    });

    s.on("queue:leave", () => {
      const i = waiting.findIndex(w => w.id === s.id);
      if (i >= 0) waiting.splice(i,1);
      const p = buddy.get(s.id);
      if (p) {
        buddy.delete(p); buddy.delete(s.id);
        io.sockets.sockets.get(p)?.emit("partner:left");
      }
      s.data.joined = false;
      console.log("[queue:leave]", s.id);
    });

    for (const ev of ["webrtc:offer","webrtc:answer","webrtc:ice"] as const) {
      s.on(ev, (payload: any) => {
        const p = buddy.get(s.id);
        if (p) io.sockets.sockets.get(p)?.emit(ev, payload);
      });
    }

    s.on("disconnect", () => {
      const i = waiting.findIndex(w => w.id === s.id);
      if (i >= 0) waiting.splice(i,1);
      const p = buddy.get(s.id);
      if (p) {
        buddy.delete(p); buddy.delete(s.id);
        io.sockets.sockets.get(p)?.emit("partner:left");
      }
      console.log("[io] disconnect", s.id);
    });

    s.emit("hello", { id: s.id, t: Date.now() });
  });

  console.log("[socket-matcher] attached (logs on)");
}
