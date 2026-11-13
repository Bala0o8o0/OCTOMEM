import { z } from "zod";

export const MessageTurnSchema = z.object({
  id: z.string(),
  role: z.enum(["user", "assistant", "system"]),
  content: z.string(),
  timestamp: z.number().optional().default(() => Date.now()),
  toolInvocations: z.array(z.any()).optional(),
  attachments: z.array(z.any()).optional(),
  experimental_attachments: z.array(z.any()).optional(),
});

export type MessageTurn = z.infer<typeof MessageTurnSchema>;

export const ChronoCardPayloadV1Schema = z.object({
  format: z.literal("chronocard"),
  version: z.literal(1),
  cardId: z.string(),
  createdAt: z.string(),
  metadata: z.object({
    agentId: z.string(),
    agentName: z.string(),
    cardTitle: z.string(),
    turnCount: z.number(),
    tags: z.array(z.string()).default([]),
  }),
  state: z.object({
    worldState: z.string().default(""),
    coreFacts: z.array(z.string()).default([]),
    recentMessages: z.array(MessageTurnSchema).default([]),
  }),
});

export type ChronoCardPayloadV1 = z.infer<typeof ChronoCardPayloadV1Schema>;

export const CryptoEnvelopeV1Schema = z.object({
  format: z.literal("chronocard"),
  envelopeVersion: z.literal(1),
  encrypted: z.boolean(),
  compression: z.literal("gzip"),
  kdf: z.literal("scrypt").optional(),
  kdfParams: z
    .object({
      N: z.number(),
      r: z.number(),
      p: z.number(),
    })
    .optional(),
  salt: z.string().optional(), // Base64
  iv: z.string().optional(), // Base64, 12 bytes
  ciphertext: z.string().optional(), // Base64
  authTag: z.string().optional(), // Base64
  payload: z.string().optional(), // Base64 when unencrypted
});

export type CryptoEnvelopeV1 = z.infer<typeof CryptoEnvelopeV1Schema>;
