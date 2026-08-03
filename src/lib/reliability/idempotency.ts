import { createHash, timingSafeEqual } from "node:crypto";

export function idempotencyKey(provider: string, externalId: string) {
  return createHash("sha256").update(`${provider}:${externalId}`).digest("hex");
}

export function matchesIdempotencyKey(expected: string, received: string) {
  const a = Buffer.from(expected); const b = Buffer.from(received);
  return a.length === b.length && timingSafeEqual(a, b);
}
