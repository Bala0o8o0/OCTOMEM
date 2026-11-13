import { MessageTurn } from "../card/schema";

export interface MemorySummarizationResult {
  worldState: string;
  coreFacts: string[];
  recentMessages: MessageTurn[];
}

/**
 * Summarizes older messages into worldState & coreFacts,
 * preserving the latest 4-6 turns verbatim for immediate continuity.
 */
export async function summarizeConversationMemory(
  messages: MessageTurn[],
  existingWorldState?: string,
  existingCoreFacts?: string[]
): Promise<MemorySummarizationResult> {
  const VERBATIM_TURN_BUDGET = 6;

  if (messages.length <= VERBATIM_TURN_BUDGET) {
    return {
      worldState: existingWorldState || "Fresh conversation session.",
      coreFacts: existingCoreFacts || [],
      recentMessages: messages,
    };
  }

  // Split into older turns and recent turns
  const olderTurns = messages.slice(0, messages.length - VERBATIM_TURN_BUDGET);
  const recentTurns = messages.slice(messages.length - VERBATIM_TURN_BUDGET);

  // Extract key topics & facts from older turns
  const extractedFacts: string[] = existingCoreFacts ? [...existingCoreFacts] : [];

  for (const turn of olderTurns) {
    if (turn.role === "user" && turn.content.length > 20) {
      const snippet = turn.content.slice(0, 100).replace(/\n/g, " ");
      if (!extractedFacts.some((f) => f.includes(snippet.slice(0, 40)))) {
        extractedFacts.push(`User discussed: "${snippet}..."`);
      }
    }
  }

  // Cap facts to 12 most relevant
  const trimmedFacts = extractedFacts.slice(-12);

  const worldState = [
    existingWorldState ? `Prior state: ${existingWorldState}` : "",
    `Summary: ${olderTurns.length} earlier turns archived. Focus is on current active thread.`,
  ]
    .filter(Boolean)
    .join(" ");

  return {
    worldState,
    coreFacts: trimmedFacts,
    recentMessages: recentTurns,
  };
}
