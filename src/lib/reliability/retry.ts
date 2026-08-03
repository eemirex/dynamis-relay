export type RetryPolicy = {
  maxAttempts: number;
  baseDelayMs: number;
  maxDelayMs: number;
  jitter: "full" | "none";
};

export const defaultRetryPolicy: RetryPolicy = {
  maxAttempts: 5, baseDelayMs: 1_000, maxDelayMs: 60_000, jitter: "full",
};

export function retryDelay(attempt: number, policy = defaultRetryPolicy, random = Math.random) {
  const exponential = Math.min(policy.maxDelayMs, policy.baseDelayMs * 2 ** Math.max(0, attempt - 1));
  return policy.jitter === "full" ? Math.floor(random() * exponential) : exponential;
}

export function isRetryableStatus(status: number) {
  return status === 408 || status === 409 || status === 425 || status === 429 || status >= 500;
}

export async function withRetry<T>(
  operation: (attempt: number) => Promise<T>,
  options: { policy?: RetryPolicy; shouldRetry?: (error: unknown) => boolean; sleep?: (ms: number) => Promise<void> } = {},
) {
  const policy = options.policy ?? defaultRetryPolicy;
  const shouldRetry = options.shouldRetry ?? (() => true);
  const sleep = options.sleep ?? ((ms) => new Promise((resolve) => setTimeout(resolve, ms)));
  let lastError: unknown;
  for (let attempt = 1; attempt <= policy.maxAttempts; attempt += 1) {
    try { return await operation(attempt); }
    catch (error) {
      lastError = error;
      if (attempt === policy.maxAttempts || !shouldRetry(error)) throw error;
      await sleep(retryDelay(attempt, policy));
    }
  }
  throw lastError;
}
