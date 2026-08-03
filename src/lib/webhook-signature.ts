import { createHmac, timingSafeEqual } from "node:crypto";

export function signInbound(payload: string, timestamp: string, secret: string) { return createHmac("sha256", secret).update(`${timestamp}.${payload}`).digest("hex"); }
export function verifyInbound(payload: string, timestamp: string, signature: string, secret: string) {
  const age = Math.abs(Date.now() - Number(timestamp) * 1000); if (!Number.isFinite(age) || age > 300_000) return false;
  const expected = Buffer.from(signInbound(payload, timestamp, secret)); const received = Buffer.from(signature);
  return expected.length === received.length && timingSafeEqual(expected, received);
}
