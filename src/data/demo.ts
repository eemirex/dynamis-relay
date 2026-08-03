export type TicketStatus = "new" | "triaged" | "open" | "pending_customer" | "pending_internal" | "resolved" | "closed";
export type TicketPriority = "urgent" | "high" | "normal" | "low";

export type Message = { id: string; author: string; role: "customer" | "agent" | "system"; body: string; time: string };
export type Ticket = {
  id: string; subject: string; customer: string; initials: string; company: string; email: string;
  channel: "email" | "chat" | "whatsapp" | "api"; status: TicketStatus; priority: TicketPriority;
  sentiment: "frustrated" | "neutral" | "positive"; assignee: string; updated: string; preview: string;
  sla: string; tags: string[]; aiConfidence: number; messages: Message[];
};

export const tickets: Ticket[] = [
  {
    id: "RLY-1048", subject: "Unable to export monthly finance report", customer: "Amara Okafor", initials: "AO",
    company: "Kora Labs", email: "amara@koralabs.co", channel: "email", status: "open", priority: "urgent",
    sentiment: "frustrated", assignee: "Emmanuel", updated: "4m", preview: "The export has failed three times and our board pack is due today.",
    sla: "22m", tags: ["export", "enterprise"], aiConfidence: 94,
    messages: [
      { id: "m1", author: "Amara Okafor", role: "customer", time: "10:14 AM", body: "Hi team, the monthly finance report export has failed three times this morning. It gets to 87% and returns an unknown error. Our board pack is due today, so this is now urgent." },
      { id: "m2", author: "Relay", role: "system", time: "10:14 AM", body: "Tagged as export · Urgent priority · SLA due in 26 minutes" },
      { id: "m3", author: "Emmanuel", role: "agent", time: "10:19 AM", body: "Thanks for flagging this, Amara. I’m checking the export job now and will keep you updated here." },
      { id: "m4", author: "Amara Okafor", role: "customer", time: "10:25 AM", body: "Thank you. The report covers January through June and includes our three regional entities." },
    ],
  },
  {
    id: "RLY-1047", subject: "SSO mapping for contractor accounts", customer: "Nina James", initials: "NJ", company: "BrightPay",
    email: "nina@brightpay.io", channel: "chat", status: "pending_internal", priority: "high", sentiment: "neutral", assignee: "Maya",
    updated: "9m", preview: "Can contractors inherit the same SCIM groups as full-time staff?", sla: "1h 08m", tags: ["sso", "security"], aiConfidence: 88,
    messages: [{ id: "m5", author: "Nina James", role: "customer", time: "10:09 AM", body: "Can contractors inherit the same SCIM groups as full-time staff, or should we create a separate role mapping?" }],
  },
  {
    id: "RLY-1046", subject: "Webhook signatures changed after rotation", customer: "David Mensah", initials: "DM", company: "Fieldwork",
    email: "david@fieldwork.dev", channel: "api", status: "triaged", priority: "high", sentiment: "frustrated", assignee: "Unassigned",
    updated: "17m", preview: "Requests started failing signature validation immediately after rotation.", sla: "42m", tags: ["webhooks", "developer"], aiConfidence: 91,
    messages: [{ id: "m6", author: "David Mensah", role: "customer", time: "10:01 AM", body: "Our webhook endpoint started rejecting all Relay events after we rotated the secret. Can you confirm the signature version?" }],
  },
  {
    id: "RLY-1045", subject: "Add Portuguese to help center", customer: "Sofia Ramos", initials: "SR", company: "Atlas Works",
    email: "sofia@atlasworks.com", channel: "whatsapp", status: "pending_customer", priority: "normal", sentiment: "positive", assignee: "Amara",
    updated: "28m", preview: "We’re ready to translate our top twenty articles for the Brazil launch.", sla: "3h 21m", tags: ["localisation", "help-center"], aiConfidence: 86,
    messages: [{ id: "m7", author: "Sofia Ramos", role: "customer", time: "9:50 AM", body: "We’re ready to translate our top twenty help articles for the Brazil launch. What format should we send?" }],
  },
  {
    id: "RLY-1044", subject: "Invoice shows duplicate workspace seats", customer: "Ibrahim Bello", initials: "IB", company: "Northstar",
    email: "ibrahim@northstar.app", channel: "email", status: "open", priority: "normal", sentiment: "neutral", assignee: "Emmanuel",
    updated: "41m", preview: "The July invoice appears to count seven people who left in June.", sla: "2h 14m", tags: ["billing"], aiConfidence: 96,
    messages: [{ id: "m8", author: "Ibrahim Bello", role: "customer", time: "9:37 AM", body: "The July invoice appears to count seven people who left in June. Could you review the seat calculation?" }],
  },
  {
    id: "RLY-1043", subject: "Mobile push notifications delayed", customer: "Lena Wu", initials: "LW", company: "Meridian",
    email: "lena@meridian.health", channel: "chat", status: "new", priority: "normal", sentiment: "neutral", assignee: "Unassigned",
    updated: "53m", preview: "Notifications arrive around ten minutes after the message is received.", sla: "2h 07m", tags: ["mobile", "notifications"], aiConfidence: 82,
    messages: [{ id: "m9", author: "Lena Wu", role: "customer", time: "9:25 AM", body: "Push notifications arrive around ten minutes after the message is received on iOS." }],
  },
  {
    id: "RLY-1042", subject: "Data retention policy confirmation", customer: "Theo Grant", initials: "TG", company: "Aperture",
    email: "theo@aperture.studio", channel: "email", status: "resolved", priority: "low", sentiment: "positive", assignee: "Maya",
    updated: "1h", preview: "That answers our security review. Thanks for the quick clarification.", sla: "Met", tags: ["security", "compliance"], aiConfidence: 98,
    messages: [{ id: "m10", author: "Theo Grant", role: "customer", time: "9:12 AM", body: "That answers our security review. Thanks for the quick clarification." }],
  },
];

export const activities = [
  { initials: "AO", color: "coral", text: "Amara replied to RLY-1048", detail: "Urgent · Kora Labs", time: "4m" },
  { initials: "AI", color: "purple", text: "Relay drafted 14 responses", detail: "11 accepted without edits", time: "12m" },
  { initials: "MK", color: "blue", text: "Maya resolved RLY-1039", detail: "First-contact resolution", time: "23m" },
  { initials: "SY", color: "teal", text: "Webhook delivery recovered", detail: "Succeeded on attempt 3", time: "31m" },
];

export const knowledgeArticles = [
  { title: "Troubleshoot report exports", collection: "Analytics", status: "Published", uses: 184, helpful: 94, updated: "2 days ago" },
  { title: "Configure SAML SSO and SCIM", collection: "Security", status: "Published", uses: 126, helpful: 91, updated: "5 days ago" },
  { title: "Verify webhook signatures", collection: "Developers", status: "Published", uses: 98, helpful: 97, updated: "1 week ago" },
  { title: "Manage seats and billing", collection: "Workspace", status: "Published", uses: 76, helpful: 89, updated: "1 week ago" },
  { title: "Launch a translated help center", collection: "Help center", status: "Draft", uses: 0, helpful: 0, updated: "3 hours ago" },
];

export const automationRules = [
  { name: "Escalate frustrated enterprise customers", trigger: "Sentiment becomes frustrated", action: "Set urgent · assign senior queue", runs: 42, state: true },
  { name: "Auto-resolve confirmed answers", trigger: "Customer confirms resolution", action: "Wait 24h · mark resolved", runs: 128, state: true },
  { name: "Route developer questions", trigger: "Tag contains developer", action: "Assign technical support", runs: 87, state: true },
  { name: "Weekend acknowledgement", trigger: "Message received outside hours", action: "Send approved acknowledgement", runs: 19, state: false },
];
