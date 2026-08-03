import { describe, expect, it } from "vitest";
import { canTransition, transitionTicket } from "./state-machine";

describe("ticket state machine", () => {
  it("allows an open ticket to wait on a customer", () => expect(canTransition("open", "pending_customer")).toBe(true));
  it("allows a closed ticket to reopen", () => expect(canTransition("closed", "open")).toBe(true));
  it("rejects skipping from new to resolved", () => expect(() => transitionTicket("new", "resolved")).toThrow(/cannot transition/));
});
