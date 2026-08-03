import OpenAI from "openai";

export const SUPPORT_MODEL = "gpt-5.4-mini";
export function createAIClient() { if (!process.env.OPENAI_API_KEY) throw new Error("AI provider is not configured."); return new OpenAI({ apiKey: process.env.OPENAI_API_KEY, baseURL: process.env.OPENAI_BASE_URL || undefined }); }
export function safeText(value: unknown, max = 10_000) { return typeof value === "string" ? value.trim().slice(0, max) : ""; }
