import { NextRequest, NextResponse } from "next/server";
import { ChronoCardPayloadV1, MessageTurn } from "@/lib/card/schema";
import { packEnvelope } from "@/lib/crypto/envelope";
import { generateBaseCardPng } from "@/lib/card/render";
import { injectChronoCardChunk } from "@/lib/png/chunk";
import { summarizeConversationMemory } from "@/lib/ai/summarize-memory";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      agentId = "agent-archivist-01",
      agentName = "Archivist",
      cardTitle = "Conversation Memory",
      messages = [] as MessageTurn[],
      passphrase,
      worldState = "",
      coreFacts = [] as string[],
      tags = ["memory", "chronocard"],
      customImageBase64,
    } = body;

    // Summarize older memory and keep recent turns verbatim
    const summary = await summarizeConversationMemory(
      messages,
      worldState,
      coreFacts
    );

    const payload: ChronoCardPayloadV1 = {
      format: "chronocard",
      version: 1,
      cardId: `card_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      createdAt: new Date().toISOString(),
      metadata: {
        agentId,
        agentName,
        cardTitle,
        turnCount: messages.length,
        tags,
      },
      state: {
        worldState: summary.worldState,
        coreFacts: summary.coreFacts,
        recentMessages: summary.recentMessages,
      },
    };

    // Pack envelope (with gzip & optional AES-256-GCM encryption)
    const encodedEnvelope = packEnvelope(payload, passphrase);

    // Use user's custom uploaded PNG if provided, otherwise generate Apple Glass base PNG
    let basePng: Buffer;
    if (customImageBase64 && typeof customImageBase64 === "string") {
      const cleanBase64 = customImageBase64.replace(/^data:image\/\w+;base64,/, "");
      basePng = Buffer.from(cleanBase64, "base64");
    } else {
      basePng = generateBaseCardPng(640, 400, passphrase ? "emerald" : "blue");
    }

    // Inject chunk before IEND
    const finalPng = injectChronoCardChunk(basePng, encodedEnvelope);

    const safeTitle = cardTitle.replace(/[^a-zA-Z0-9_-]/g, "_").slice(0, 32);

    return new NextResponse(new Uint8Array(finalPng), {
      status: 200,
      headers: {
        "Content-Type": "image/png",
        "Content-Disposition": `attachment; filename="ChronoCard_${safeTitle}.png"`,
        "Cache-Control": "no-store, max-age=0",
        "X-ChronoCard-Encrypted": passphrase ? "true" : "false",
        "X-ChronoCard-Turns": String(messages.length),
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to export card";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
