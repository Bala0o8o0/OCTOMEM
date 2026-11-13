import { packEnvelope, unpackEnvelope } from "../src/lib/crypto/envelope";
import { generateBaseCardPng } from "../src/lib/card/render";
import { injectChronoCardChunk, extractChronoCardChunk, parsePngChunks } from "../src/lib/png/chunk";

async function runTests() {
  console.log("=========================================");
  console.log("🧪 ChronoCard AI End-to-End Pipeline Test");
  console.log("=========================================\n");

  const mockPayload = {
    format: "chronocard" as const,
    version: 1 as const,
    cardId: "card_test_12345",
    createdAt: new Date().toISOString(),
    metadata: {
      agentId: "agent-archivist-01",
      agentName: "Aria, Apple Glass Archivist",
      cardTitle: "Deep Neural Navigation",
      turnCount: 4,
      tags: ["neural", "apple-design"],
    },
    state: {
      worldState: "Exploration of deep ocean vents completed successfully.",
      coreFacts: [
        "Vent temperature: 382C",
        "Coordinates: [24.88N, 142.11E]",
      ],
      recentMessages: [
        { id: "1", role: "user" as const, content: "Scan the perimeter.", timestamp: 1000 },
        { id: "2", role: "assistant" as const, content: "Perimeter is clear.", timestamp: 2000 },
      ],
    },
  };

  // Test 1: Encrypted Card Export & Import
  console.log("1. Testing Encrypted Card (AES-256-GCM + scrypt)...");
  const passphrase = "SuperSecretApplePassword123!";
  const encryptedEnvelope = packEnvelope(mockPayload, passphrase);
  console.log("   ✓ Packed & encrypted payload envelope, base64 length:", encryptedEnvelope.length);

  const basePng = generateBaseCardPng(640, 400, "emerald");
  console.log("   ✓ Generated Apple Glass base PNG buffer:", basePng.length, "bytes");

  const injectedPng = injectChronoCardChunk(basePng, encryptedEnvelope);
  console.log("   ✓ Injected 'chronocard_state' chunk. Total PNG size:", injectedPng.length, "bytes");

  // Verify PNG Chunks
  const chunks = parsePngChunks(injectedPng);
  const chunkTypes = chunks.map((c: { type: string }) => c.type);
  console.log("   ✓ Verified PNG chunks order:", chunkTypes.join(" -> "));
  if (!chunkTypes.includes("tEXt") || chunkTypes[chunkTypes.length - 1] !== "IEND") {
    throw new Error("Invalid chunk structure!");
  }

  // Extract chunk
  const extractedRaw = extractChronoCardChunk(injectedPng);
  if (!extractedRaw) throw new Error("Failed to extract chunk!");
  console.log("   ✓ Successfully extracted chunk from PNG");

  // Test wrong passphrase
  console.log("2. Testing Wrong Passphrase Protection...");
  const wrongAttempt = unpackEnvelope(extractedRaw, "WrongPassword!");
  if (wrongAttempt.success) throw new Error("Security breach: Decrypted with wrong password!");
  console.log("   ✓ Successfully failed closed with message:", wrongAttempt.error);

  // Test correct passphrase
  console.log("3. Testing Correct Passphrase Authentication...");
  const correctAttempt = unpackEnvelope(extractedRaw, passphrase);
  if (!correctAttempt.success || !correctAttempt.payload) {
    throw new Error("Failed to decrypt with correct passphrase: " + correctAttempt.error);
  }
  console.log("   ✓ Decrypted and validated Zod schema successfully!");
  console.log("   ✓ Restored Card Title:", correctAttempt.payload.metadata.cardTitle);
  console.log("   ✓ Restored Agent Name:", correctAttempt.payload.metadata.agentName);
  console.log("   ✓ Restored Core Facts:", correctAttempt.payload.state.coreFacts.length);
  console.log("   ✓ Restored Messages:", correctAttempt.payload.state.recentMessages.length);

  // Test 4: Unencrypted Card
  console.log("\n4. Testing Unencrypted Portable Card...");
  const plainEnvelope = packEnvelope(mockPayload);
  const plainPng = injectChronoCardChunk(basePng, plainEnvelope);
  const plainExtracted = extractChronoCardChunk(plainPng);
  if (!plainExtracted) throw new Error("Failed to extract plain chunk!");
  const plainResult = unpackEnvelope(plainExtracted);
  if (!plainResult.success || !plainResult.payload) {
    throw new Error("Failed to unpack unencrypted card!");
  }
  console.log("   ✓ Unencrypted card unpacked directly without passphrase!");

  console.log("\n=========================================");
  console.log("🎉 ALL TESTS PASSED (100% SUCCESS)!");
  console.log("=========================================");
}

runTests().catch(err => {
  console.error("❌ Test failed:", err);
  process.exit(1);
});
