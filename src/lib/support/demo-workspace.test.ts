import { describe, expect, it } from "vitest";
import { tickets } from "../../data/demo";
import { createDemoTicket, demoReply, draftReducer, type NewDemoTicket } from "./demo-workspace";

const input: NewDemoTicket = { customer: "  Lena Wu  ", company: "Meridian", subject: " Push notifications ", message: " Delayed notifications on iOS. ", priority: "high", channel: "chat", assignee: "Emmanuel" };

describe("demo ticket creation", () => {
  it("preserves the form fields and initial customer message", () => {
    const ticket = createDemoTicket(input, tickets);
    expect(ticket).toMatchObject({ id: "RLY-1049", customer: "Lena Wu", initials: "LW", subject: "Push notifications", company: "Meridian", priority: "high", channel: "chat", assignee: "Emmanuel", status: "new" });
    expect(ticket.messages[0]).toMatchObject({ author: "Lena Wu", role: "customer", body: "Delayed notifications on iOS." });
  });
  it("assigns distinct references after each creation", () => {
    const first = createDemoTicket(input, tickets);
    expect(createDemoTicket(input, [first, ...tickets]).id).toBe("RLY-1050");
  });
  it("rejects whitespace-only required fields", () => {
    for (const field of ["customer", "subject", "message"]) expect(() => createDemoTicket({ ...input, [field]: "   " }, tickets)).toThrow(/required/);
  });
  it("drafts for the selected customer without claiming a completed fix", () => {
    const reply = demoReply(createDemoTicket(input, tickets));
    expect(reply).toContain("Hi Lena");
    expect(reply).toContain("Push notifications");
    expect(reply).not.toContain("Amara");
    expect(reply).not.toContain("restarted");
  });
});

describe("conversation draft isolation", () => {
  it("preserves independent edits when conversations switch", () => {
    let state = draftReducer({}, { type: "edit", ticketId: "A", text: "Reply for A" });
    state = draftReducer(state, { type: "edit", ticketId: "B", text: "Reply for B" });
    expect(state.A.text).toBe("Reply for A");
    expect(state.B.text).toBe("Reply for B");
  });
  it("places a late generation in its originating conversation", () => {
    let state = draftReducer({}, { type: "start", ticketId: "A", requestId: "r1" });
    state = draftReducer(state, { type: "edit", ticketId: "B", text: "Manual reply" });
    state = draftReducer(state, { type: "generated", ticketId: "A", requestId: "r1", text: "Generated A" });
    expect(state.A.text).toBe("Generated A");
    expect(state.B.text).toBe("Manual reply");
    expect(state.A.requestId).toBeNull();
  });
  it("ignores an obsolete generation after a manual edit", () => {
    let state = draftReducer({}, { type: "start", ticketId: "A", requestId: "r1" });
    state = draftReducer(state, { type: "edit", ticketId: "A", text: "Keep my edit" });
    expect(draftReducer(state, { type: "generated", ticketId: "A", requestId: "r1", text: "Stale" })).toBe(state);
  });
  it("accepts only the newest generation request for a ticket", () => {
    let state = draftReducer({}, { type: "start", ticketId: "A", requestId: "old" });
    state = draftReducer(state, { type: "start", ticketId: "A", requestId: "new" });
    expect(draftReducer(state, { type: "generated", ticketId: "A", requestId: "old", text: "Stale" })).toBe(state);
    state = draftReducer(state, { type: "generated", ticketId: "A", requestId: "new", text: "Latest" });
    expect(state.A.text).toBe("Latest");
  });
  it("clears only the sent conversation and rejects its late result", () => {
    let state = draftReducer({}, { type: "edit", ticketId: "B", text: "Unsent B" });
    state = draftReducer(state, { type: "start", ticketId: "A", requestId: "r1" });
    state = draftReducer(state, { type: "clear", ticketId: "A" });
    state = draftReducer(state, { type: "generated", ticketId: "A", requestId: "r1", text: "Stale" });
    expect(state.A.text).toBe("");
    expect(state.B.text).toBe("Unsent B");
  });
});

