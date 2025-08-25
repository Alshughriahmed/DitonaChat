
// utils/adminGuard.ts
export function adminGuard(req: any, res: any): boolean {
  const xff = (req.headers["x-forwarded-for"] || "").toString();
  const remote = (req.socket && req.socket.remoteAddress) || "";
  const local = remote === "127.0.0.1" || remote === "::1" || xff.startsWith("127.0.0.1");
  const token = (req.headers["x-admin-token"] || "").toString();
  if (!local && (!process.env.RL_ADMIN_TOKEN || token !== process.env.RL_ADMIN_TOKEN)) {
    res.statusCode = 404; res.end(""); return false;
  }
  return true;
}
