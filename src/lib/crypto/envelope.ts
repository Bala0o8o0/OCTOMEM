import crypto from "crypto";
import zlib from "zlib";
import {
  ChronoCardPayloadV1,
  ChronoCardPayloadV1Schema,
  CryptoEnvelopeV1,
  CryptoEnvelopeV1Schema,
} from "../card/schema";

// Maximum allowed decompressed payload size (2 MB) to mitigate gzip bombs
export const MAX_DECOMPRESSED_PAYLOAD_SIZE = 2 * 1024 * 1024;

const DEFAULT_SCRYPT_PARAMS = {
  N: 16384,
  r: 8,
  p: 1,
};

/**
 * Packages a ChronoCardPayloadV1 into an encoded envelope string
 */
export function packEnvelope(
  payload: ChronoCardPayloadV1,
  passphrase?: string
): string {
  // Validate schema
  const validatedPayload = ChronoCardPayloadV1Schema.parse(payload);
  const jsonStr = JSON.stringify(validatedPayload);
  const rawBytes = Buffer.from(jsonStr, "utf-8");

  // Gzip compression
  const compressedBytes = zlib.gzipSync(rawBytes, { level: 9 });

  let envelope: CryptoEnvelopeV1;

  if (passphrase && passphrase.trim().length > 0) {
    // Encrypt with AES-256-GCM
    const salt = crypto.randomBytes(16);
    const iv = crypto.randomBytes(12);

    const key = crypto.scryptSync(passphrase.trim(), salt, 32, {
      N: DEFAULT_SCRYPT_PARAMS.N,
      r: DEFAULT_SCRYPT_PARAMS.r,
      p: DEFAULT_SCRYPT_PARAMS.p,
    });

    const cipher = crypto.createCipheriv("aes-256-gcm", key, iv);
    const ciphertext = Buffer.concat([
      cipher.update(compressedBytes),
      cipher.final(),
    ]);
    const authTag = cipher.getAuthTag();

    envelope = {
      format: "chronocard",
      envelopeVersion: 1,
      encrypted: true,
      compression: "gzip",
      kdf: "scrypt",
      kdfParams: DEFAULT_SCRYPT_PARAMS,
      salt: salt.toString("base64"),
      iv: iv.toString("base64"),
      ciphertext: ciphertext.toString("base64"),
      authTag: authTag.toString("base64"),
    };
  } else {
    // Plain compressed
    envelope = {
      format: "chronocard",
      envelopeVersion: 1,
      encrypted: false,
      compression: "gzip",
      payload: compressedBytes.toString("base64"),
    };
  }

  // Serialize envelope to Base64
  return Buffer.from(JSON.stringify(envelope), "utf-8").toString("base64");
}

export interface UnpackResult {
  success: boolean;
  requiresPassphrase?: boolean;
  payload?: ChronoCardPayloadV1;
  error?: string;
}

/**
 * Unpacks an encoded envelope string back into ChronoCardPayloadV1
 */
export function unpackEnvelope(
  encodedEnvelope: string,
  passphrase?: string
): UnpackResult {
  try {
    const envelopeJson = Buffer.from(encodedEnvelope, "base64").toString("utf-8");
    const rawParsed = JSON.parse(envelopeJson);
    const envelope = CryptoEnvelopeV1Schema.parse(rawParsed);

    if (envelope.encrypted) {
      if (!passphrase || passphrase.trim().length === 0) {
        return {
          success: false,
          requiresPassphrase: true,
          error: "Card is encrypted. Passphrase required to decrypt.",
        };
      }

      if (!envelope.salt || !envelope.iv || !envelope.ciphertext || !envelope.authTag) {
        return {
          success: false,
          error: "Malformed crypto envelope: Missing required encryption parameters.",
        };
      }

      const salt = Buffer.from(envelope.salt, "base64");
      const iv = Buffer.from(envelope.iv, "base64");
      const ciphertext = Buffer.from(envelope.ciphertext, "base64");
      const authTag = Buffer.from(envelope.authTag, "base64");

      const kdfParams = envelope.kdfParams || DEFAULT_SCRYPT_PARAMS;
      const key = crypto.scryptSync(passphrase.trim(), salt, 32, {
        N: kdfParams.N,
        r: kdfParams.r,
        p: kdfParams.p,
      });

      const decipher = crypto.createDecipheriv("aes-256-gcm", key, iv);
      decipher.setAuthTag(authTag);

      let compressedBytes: Buffer;
      try {
        compressedBytes = Buffer.concat([
          decipher.update(ciphertext),
          decipher.final(),
        ]);
      } catch {
        return {
          success: false,
          error: "Authentication failed: Incorrect passphrase or altered ciphertext.",
        };
      }

      // Decompress with size limit guard
      const decompressed = safeGunzip(compressedBytes);
      const parsedPayload = JSON.parse(decompressed.toString("utf-8"));
      const validPayload = ChronoCardPayloadV1Schema.parse(parsedPayload);

      return {
        success: true,
        payload: validPayload,
      };
    } else {
      if (!envelope.payload) {
        return {
          success: false,
          error: "Malformed envelope: Missing payload in unencrypted card.",
        };
      }

      const compressedBytes = Buffer.from(envelope.payload, "base64");
      const decompressed = safeGunzip(compressedBytes);
      const parsedPayload = JSON.parse(decompressed.toString("utf-8"));
      const validPayload = ChronoCardPayloadV1Schema.parse(parsedPayload);

      return {
        success: true,
        payload: validPayload,
      };
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown unpacking error";
    return {
      success: false,
      error: `Failed to unpack card: ${message}`,
    };
  }
}

function safeGunzip(compressed: Buffer): Buffer {
  const decompressed = zlib.gunzipSync(compressed, {
    maxOutputLength: MAX_DECOMPRESSED_PAYLOAD_SIZE,
  });

  if (decompressed.length > MAX_DECOMPRESSED_PAYLOAD_SIZE) {
    throw new Error("Decompressed payload exceeds safety budget limit.");
  }

  return decompressed;
}
