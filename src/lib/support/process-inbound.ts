import { idempotencyKey } from "../reliability/idempotency";
import { withRetry, isRetryableStatus } from "../reliability/retry";

export type InboundEvent = { provider: string; externalId: string; organizationId: string; customer: { email: string; name?: string }; message: string; channel: string };
export type ProcessorDependencies = {
  claim: (key: string, event: InboundEvent) => Promise<"claimed" | "duplicate">;
  classify: (event: InboundEvent) => Promise<{ intent: string; priority: string; sentiment: string }>;
  persist: (event: InboundEvent, classification: { intent: string; priority: string; sentiment: string }) => Promise<{ ticketId: string }>;
  enqueueOutbox: (ticketId: string, type: string) => Promise<void>;
};

export async function processInbound(event: InboundEvent, dependencies: ProcessorDependencies) {
  const key = idempotencyKey(event.provider, event.externalId);
  if (await dependencies.claim(key, event) === "duplicate") return { status: "duplicate" as const, key };
  const classification = await withRetry(() => dependencies.classify(event), { shouldRetry: (error) => typeof error === "object" && error !== null && "status" in error && isRetryableStatus(Number((error as { status: unknown }).status)) });
  const { ticketId } = await dependencies.persist(event, classification);
  await dependencies.enqueueOutbox(ticketId, "ticket.created");
  return { status: "processed" as const, key, ticketId, classification };
}
