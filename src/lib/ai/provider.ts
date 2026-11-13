/**
 * Universal Cloud AI Provider Adapter
 * Connects to 100% online cloud providers (NVIDIA NIM, OpenRouter, OpenAI, Custom)
 * Using Vercel AI SDK interface
 */

export interface ModelProviderConfig {
  provider: "nvidia" | "openrouter" | "custom";
  apiKey: string;
  model: string;
  baseUrl?: string;
}

export const PROVIDER_PRESETS: Record<
  string,
  { name: string; baseUrl: string; defaultModel: string; isFree: boolean }
> = {
  nvidia: {
    name: "NVIDIA NIM Cloud",
    baseUrl: "https://integrate.api.nvidia.com/v1",
    defaultModel: "meta/llama-3.3-70b-instruct",
    isFree: true,
  },
  openrouter: {
    name: "OpenRouter Free",
    baseUrl: "https://openrouter.ai/api/v1",
    defaultModel: "nousresearch/hermes-3-llama-3.1-405b:free",
    isFree: true,
  },
  openrouter_llama: {
    name: "OpenRouter Llama 3.3",
    baseUrl: "https://openrouter.ai/api/v1",
    defaultModel: "meta-llama/llama-3.3-70b-instruct:free",
    isFree: true,
  },
  openai: {
    name: "OpenAI Official",
    baseUrl: "https://api.openai.com/v1",
    defaultModel: "gpt-4o-mini",
    isFree: false,
  },
};

export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface MemoryContext {
  worldState?: string;
  coreFacts?: string[];
  agentName?: string;
}

/**
 * Builds the system instruction incorporating rehydrated card context and agent tooling
 */
export function buildSystemPrompt(agentName?: string, memory?: MemoryContext): string {
  const parts: string[] = [
    `You are ${agentName || "OCTOBOT"}, an intelligent, autonomous, and perceptive AI assistant.`,
    `You maintain continuity of conversation and knowledge through portable ChronoCard memory cartridges embedded inside lossless PNG artwork (compliant with ISO/IEC 15948:2004).`,
    `\n[AUTONOMOUS AGENT TOOLS]`,
    `You have direct access to sovereign agent tools to assist the operator:`,
    `• browseWeb: Search the live web for real-time information, technical docs, APIs, release notes, news, and research. Proactively call this whenever the operator asks for recent data, web search, or live verification.`,
    `• fetchWebPage: Read and extract content from web URLs discovered during research or provided by the operator.`,
    `• inspectMemoryState: Inspect the current steganographic memory cartridge status, encryption (AES-256-GCM), and loaded core facts.`,
    `• updateCompanionMemory: Autonomously record vital new facts or update the conversation world state into the memory card.`,
    `• getSystemTelemetry: Query real-time system clock, date, timezone, and cryptographic entropy.`,
    `• Document & Image Inspection: When the operator attaches documents (PDFs, Word .docx, code, notes) or images, examine them thoroughly, extract key facts, answer questions about their contents, and offer insightful syntheses.`,
  ];

  if (memory?.worldState && memory.worldState.trim().length > 0) {
    parts.push(`\n[REHYDRATED WORLD STATE]\n${memory.worldState.trim()}`);
  }

  if (memory?.coreFacts && memory.coreFacts.length > 0) {
    parts.push(`\n[ESTABLISHED CORE FACTS]\n` + memory.coreFacts.map((f) => `• ${f}`).join("\n"));
  }

  parts.push(
    `\n[OPERATIONAL DIRECTIVE]\nBe concise, direct, helpful, and perceptive. Proactively execute tools when needed. When citing web results, reference domain names and source titles cleanly.`
  );

  return parts.join("\n");
}
