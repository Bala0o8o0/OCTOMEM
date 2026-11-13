import { NextRequest } from "next/server";
import {
  streamText,
  convertToCoreMessages,
  createDataStreamResponse,
  formatDataStreamPart,
} from "ai";
import { createOpenAI } from "@ai-sdk/openai";
import { buildSystemPrompt, PROVIDER_PRESETS } from "@/lib/ai/provider";
import { createAgentTools } from "@/lib/ai/tools/agent-tools";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      messages = [],
      memory,
      agent,
      providerConfig,
    } = body;

    const providerKey = providerConfig?.provider || "nvidia";
    const preset = PROVIDER_PRESETS[providerKey] || PROVIDER_PRESETS.nvidia;

    const baseUrl = providerConfig?.baseUrl || preset.baseUrl;
    const model = providerConfig?.model || preset.defaultModel;

    // Resolve API Key: client config first, then server environment
    const apiKey =
      providerConfig?.apiKey ||
      (providerKey === "nvidia"
        ? process.env.NVIDIA_API_KEY
        : process.env.OPENROUTER_API_KEY || process.env.OPENAI_API_KEY);

    const systemPrompt = buildSystemPrompt(agent?.name, memory);
    const agentTools = createAgentTools({
      agentName: agent?.name,
      memory,
    });

    // If no API key is available yet, provide an informative guidance stream using AI SDK DataStream protocol
    if (!apiKey || apiKey.trim().length === 0) {
      return createDataStreamResponse({
        execute: async (dataStream) => {
          const guidance =
            `[OCTOBOT • Guidance Mode]\n\n` +
            `I am **OCTOBOT**, your autonomous AI assistant powered by the **Vercel AI SDK** with streaming and Generative UI.\n\n` +
            `I am equipped with autonomous tools:\n` +
            `• 🌐 **Web Scout (` +
            "`browseWeb`" +
            `)** — Live web searching with zero external API key requirements\n` +
            `• 📖 **Deep Source Inspector (` +
            "`fetchWebPage`" +
            `)** — Page reader and content extractor\n` +
            `• 🛡️ **Memory Cartridge Diagnostic (` +
            "`inspectMemoryState`" +
            `)** — Live telemetry of AES-256-GCM cipher and ISO/IEC 15948 PNG chunks\n` +
            `• 🧠 **Memory Persistence (` +
            "`updateCompanionMemory`" +
            `)** — Autonomous retention of facts into your PNG card\n\n` +
            `To enable live model inference and agent tool execution, click **Settings (⚙️)** in the top bar and enter your free API key (NVIDIA NIM or OpenRouter). You can ask me to search the web, inspect memory, or converse anytime!`;

          const words = guidance.split(" ");
          for (let i = 0; i < words.length; i++) {
            dataStream.write(formatDataStreamPart("text", (i === 0 ? "" : " ") + words[i]));
            await new Promise((r) => setTimeout(r, 18));
          }
        },
      });
    }

    // Initialize OpenAI-compatible provider client
    const openaiClient = createOpenAI({
      baseURL: baseUrl.replace(/\/+$/, ""),
      apiKey: apiKey.trim(),
    });

    // Stream with Vercel AI SDK and enable multi-step autonomous agent tool execution loop
    const result = streamText({
      model: openaiClient(model),
      system: systemPrompt,
      messages: convertToCoreMessages(messages),
      tools: agentTools,
      maxSteps: 5,
    });

    return result.toDataStreamResponse({
      getErrorMessage: (err) => {
        return err instanceof Error ? err.message : String(err);
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Chat streaming failure";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
