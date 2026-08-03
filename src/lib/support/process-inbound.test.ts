import { describe, expect, it, vi } from "vitest";
import { processInbound, type InboundEvent } from "./process-inbound";

const event: InboundEvent = { provider: "email", externalId: "msg_123", organizationId: "org_1", customer: { email: "customer@example.com" }, message: "Help", channel: "email" };
describe("inbound processor", () => {
  it("stops duplicate events before classification", async () => { const classify=vi.fn(); const result=await processInbound(event,{claim:async()=>"duplicate",classify,persist:vi.fn(),enqueueOutbox:vi.fn()}); expect(result.status).toBe("duplicate"); expect(classify).not.toHaveBeenCalled(); });
  it("persists and emits the outbox event", async () => { const enqueueOutbox=vi.fn(); const result=await processInbound(event,{claim:async()=>"claimed",classify:async()=>({intent:"support",priority:"normal",sentiment:"neutral"}),persist:async()=>({ticketId:"ticket_1"}),enqueueOutbox}); expect(result.status).toBe("processed"); expect(enqueueOutbox).toHaveBeenCalledWith("ticket_1","ticket.created"); });
});
