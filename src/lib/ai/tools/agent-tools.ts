import { tool } from "ai";
import { z } from "zod";
import { searchWeb, fetchWebPage } from "./web-search";
import { MemoryContext } from "../provider";

export interface AgentToolContext {
  agentName?: string;
  memory?: MemoryContext;
}

/**
 * Creates the complete toolset available to the ChronoCard AI agent
 */
export function createAgentTools(context?: AgentToolContext) {
  return {
    browseWeb: tool({
      description:
        "Browse and search the live web for real-time information, technical documentation, library APIs, news, and research.",
      parameters: z.object({
        query: z.string().describe("The search keywords or query"),
      }),
      execute: async ({ query }) => {
        const result = await searchWeb(query, 4);
        return result;
      },
    }),

    fetchWebPage: tool({
      description:
        "Read and extract readable text content and title from a web page URL discovered via search or provided by the operator.",
      parameters: z.object({
        url: z.string().describe("The full web page URL (http or https) to fetch"),
      }),
      execute: async ({ url }) => {
        const result = await fetchWebPage(url);
        return result;
      },
    }),

    inspectMemoryState: tool({
      description:
        "Inspect the current OCTOMEM ChronoCard steganographic memory cartridge status, cryptographic envelope state (AES-256-GCM), active core facts, and storage payload.",
      parameters: z.object({
        aspect: z
          .enum(["overview", "facts", "cipher_status", "stego_specs"])
          .optional()
          .describe("Specific memory aspect to examine"),
      }),
      execute: async ({ aspect = "overview" }) => {
        const coreFacts = context?.memory?.coreFacts || [];
        const worldState = context?.memory?.worldState || "Active Session (Unpersisted Memory)";
        const agentName = context?.agentName || "OCTOBOT";

        return {
          aspect,
          agentName,
          worldState,
          coreFactsCount: coreFacts.length,
          coreFacts,
          stegoFormat: "ISO/IEC 15948:2004 PNG ancillary chunk (tEXt: chronocard_state)",
          cipher: "AES-256-GCM",
          kdf: "scrypt (N=32768, r=8, p=1)",
          payloadStatus: "100% Client-Side In-Memory Sovereign State",
          timestamp: new Date().toISOString(),
        };
      },
    }),

    updateCompanionMemory: tool({
      description:
        "Autonomously record a crucial core fact or update the conversation world state to be baked permanently into the operator's PNG memory card.",
      parameters: z.object({
        action: z
          .enum(["add_fact", "update_world_state"])
          .describe("Action to perform on the memory cartridge"),
        fact: z
          .string()
          .optional()
          .describe("The core fact to retain permanently (required if action is add_fact)"),
        newWorldState: z
          .string()
          .optional()
          .describe("The updated world state summary (required if action is update_world_state)"),
      }),
      execute: async ({ action, fact, newWorldState }) => {
        return {
          action,
          fact: fact || null,
          newWorldState: newWorldState || null,
          status: "staged_for_steganography",
          notice:
            "Memory updated in agent working state. Operator can save to PNG anytime via the Save Memory button.",
          timestamp: new Date().toISOString(),
        };
      },
    }),

    getSystemTelemetry: tool({
      description:
        "Query the current system time, UTC timestamp, hardware inference bus state, and cryptographic entropy status.",
      parameters: z.object({
        queryDetail: z.string().optional().describe("Optional detail topic requested"),
      }),
      execute: async () => {
        const now = new Date();
        return {
          localTime: now.toLocaleTimeString(),
          localDate: now.toLocaleDateString(),
          isoTimestamp: now.toISOString(),
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          entropyStatus: "CSPRNG cryptographically secure (WebCrypto / NodeCrypto)",
          architecture: "OCTOMEM Sovereign Memory Engine",
        };
      },
    }),
  };
}
