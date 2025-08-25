import crypto from "crypto";
const SECRET = process.env.OTP_SECRET || "otp-secret";
export function generateOtp(): { code: string; hash: string; expiresAt: number } {
  const code = String(Math.floor(Math.random() * 1_000_000)).padStart(6, "0");
  const hash = crypto.createHmac("sha256", SECRET).update(code).digest("hex");
  const expiresAt = Date.now() + 5 * 60 * 1000; // 5 دقائق
  return { code, hash, expiresAt };
}
export function hashOtp(code: string): string {
  return crypto.createHmac("sha256", SECRET).update(code).digest("hex");
}
