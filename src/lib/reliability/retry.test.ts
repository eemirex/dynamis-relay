import { describe, expect, it, vi } from "vitest";
import { isRetryableStatus, retryDelay, withRetry } from "./retry";

describe("retry policy", () => {
  it("caps exponential delay", () => expect(retryDelay(9, { maxAttempts: 9, baseDelayMs: 1000, maxDelayMs: 60000, jitter: "none" })).toBe(60000));
  it("applies full jitter", () => expect(retryDelay(3, undefined, () => 0.5)).toBe(2000));
  it("retries transient failures", async () => {
    const operation = vi.fn().mockRejectedValueOnce(new Error("busy")).mockResolvedValue("ok");
    await expect(withRetry(operation, { sleep: async () => undefined })).resolves.toBe("ok");
    expect(operation).toHaveBeenCalledTimes(2);
  });
  it("classifies retryable statuses", () => { expect(isRetryableStatus(429)).toBe(true); expect(isRetryableStatus(400)).toBe(false); });
});
