export const ticketStates = ["new", "triaged", "open", "pending_customer", "pending_internal", "resolved", "closed"] as const;
export type TicketState = (typeof ticketStates)[number];

export const transitions: Record<TicketState, readonly TicketState[]> = {
  new: ["triaged", "open", "closed"],
  triaged: ["open", "pending_internal", "closed"],
  open: ["pending_customer", "pending_internal", "resolved", "closed"],
  pending_customer: ["open", "resolved", "closed"],
  pending_internal: ["open", "pending_customer", "resolved", "closed"],
  resolved: ["open", "closed"],
  closed: ["open"],
};

export function canTransition(from: TicketState, to: TicketState) {
  return transitions[from].includes(to);
}

export function transitionTicket(from: TicketState, to: TicketState) {
  if (!canTransition(from, to)) throw new InvalidTicketTransitionError(from, to);
  return { from, to, changedAt: new Date().toISOString() };
}

export class InvalidTicketTransitionError extends Error {
  constructor(from: TicketState, to: TicketState) {
    super(`Ticket cannot transition from ${from} to ${to}.`);
    this.name = "InvalidTicketTransitionError";
  }
}
