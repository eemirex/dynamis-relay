import type { Ticket } from "../../data/demo";

export type NewDemoTicket = {
  customer: string;
  company: string;
  subject: string;
  message: string;
  priority: Ticket["priority"];
  channel: Ticket["channel"];
  assignee: string;
};

export function createDemoTicket(input: NewDemoTicket, tickets: Ticket[]): Ticket {
  const customer = input.customer.trim();
  const subject = input.subject.trim();
  const message = input.message.trim();
  if (!customer || !subject || !message) throw new Error("Customer, subject, and message are required.");
  if (customer.length > 120 || subject.length > 200 || message.length > 10000) throw new Error("Please shorten the customer name, subject, or message.");
  if (!["urgent", "high", "normal", "low"].includes(input.priority) || !["email", "chat", "whatsapp", "api"].includes(input.channel)) throw new Error("Choose a valid priority and channel.");
  const number = tickets.reduce((max, ticket) => {
    const match = /^RLY-(\d+)$/.exec(ticket.id);
    return match ? Math.max(max, Number(match[1])) : max;
  }, 1048) + 1;
  const id = `RLY-${number}`;
  return {
    id, customer, subject, company: input.company.trim() || "Individual customer", email: "",
    initials: customer.split(/\s+/).slice(0, 2).map((word) => word[0]).join("").toUpperCase(),
    channel: input.channel, priority: input.priority, status: "new", sentiment: "neutral",
    assignee: input.assignee.trim() || "Unassigned", updated: "Now", preview: message,
    sla: "Not set", tags: ["manual"], aiConfidence: 0,
    messages: [{ id: `${id}-initial`, author: customer, role: "customer", body: message, time: "Now" }],
  };
}

export function demoReply(ticket: Ticket): string {
  const firstName = ticket.customer.trim().split(/\s+/)[0];
  return `Hi ${firstName} — thanks for reaching out about “${ticket.subject}”. I’ve noted the details you shared and will review the request with our team. Could you share any additional context or steps that would help us investigate? We’ll follow up here once we have a verified update.`;
}

export type Drafts = Record<string, { text: string; requestId: string | null }>;
export type DraftAction =
  | { type: "edit"; ticketId: string; text: string }
  | { type: "start"; ticketId: string; requestId: string }
  | { type: "generated"; ticketId: string; requestId: string; text: string }
  | { type: "clear"; ticketId: string };

export function draftReducer(state: Drafts, action: DraftAction): Drafts {
  const current = state[action.ticketId] ?? { text: "", requestId: null };
  if (action.type === "generated") {
    if (current.requestId !== action.requestId) return state;
    return { ...state, [action.ticketId]: { text: action.text, requestId: null } };
  }
  if (action.type === "start") return { ...state, [action.ticketId]: { ...current, requestId: action.requestId } };
  return { ...state, [action.ticketId]: { text: action.type === "edit" ? action.text : "", requestId: null } };
}

