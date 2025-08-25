import type { NextApiRequest, NextApiResponse } from "next";
import { Server as IOServer } from "socket.io";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const anyRes: any = res;
  const srv = anyRes.socket?.server;
  if (!srv) { res.status(200).json({ ok: true, note: "no-http-server" }); return; }
  if (!srv.io) {
    srv.io = new IOServer(srv, { path: "/api/socket", addTrailingSlash: false });
  }
  res.status(200).json({ ok: true });
}
