/**
 * PNG Chunk Parser and Injector for ChronoCard AI
 * Implements PNG specification ISO/IEC 15948:2004 for ancillary text chunks.
 */

const PNG_SIGNATURE = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
export const CHRONOCARD_KEYWORD = "chronocard_state";
export const OCTOMEM_KEYWORD = "octomem_state";

// Pre-computed CRC32 lookup table for fast and reliable CRC calculation
const CRC_TABLE = new Uint32Array(256);
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) {
    if (c & 1) {
      c = 0xedb88320 ^ (c >>> 1);
    } else {
      c = c >>> 1;
    }
  }
  CRC_TABLE[n] = c;
}

export function calculateCrc32(buf: Buffer): number {
  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    crc = CRC_TABLE[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

export interface PngChunk {
  length: number;
  type: string;
  data: Buffer;
  crc: number;
}

/**
 * Parses all chunks from a valid PNG buffer
 */
export function parsePngChunks(buffer: Buffer): PngChunk[] {
  if (buffer.length < 8 || !buffer.subarray(0, 8).equals(PNG_SIGNATURE)) {
    throw new Error("Invalid PNG signature: Provided buffer is not a valid PNG.");
  }

  const chunks: PngChunk[] = [];
  let offset = 8;

  while (offset < buffer.length) {
    if (offset + 8 > buffer.length) {
      throw new Error("Corrupted PNG: Truncated chunk header.");
    }

    const length = buffer.readUInt32BE(offset);
    const type = buffer.subarray(offset + 4, offset + 8).toString("ascii");
    offset += 8;

    if (offset + length + 4 > buffer.length) {
      throw new Error(`Corrupted PNG: Chunk ${type} extends beyond buffer bounds.`);
    }

    const data = buffer.subarray(offset, offset + length);
    offset += length;

    const crc = buffer.readUInt32BE(offset);
    offset += 4;

    // Verify CRC32
    const typeAndData = Buffer.concat([Buffer.from(type, "ascii"), data]);
    const computedCrc = calculateCrc32(typeAndData);
    if (computedCrc !== crc) {
      throw new Error(`CRC mismatch in PNG chunk ${type}: computed 0x${computedCrc.toString(16)}, stored 0x${crc.toString(16)}`);
    }

    chunks.push({ length, type, data, crc });

    if (type === "IEND") {
      break;
    }
  }

  return chunks;
}

/**
 * Creates a raw PNG chunk buffer from type and data with valid CRC32
 */
export function createPngChunk(type: string, data: Buffer): Buffer {
  const typeBuf = Buffer.from(type, "ascii");
  const lengthBuf = Buffer.alloc(4);
  lengthBuf.writeUInt32BE(data.length, 0);

  const crcBuf = Buffer.alloc(4);
  const typeAndData = Buffer.concat([typeBuf, data]);
  const crc = calculateCrc32(typeAndData);
  crcBuf.writeUInt32BE(crc, 0);

  return Buffer.concat([lengthBuf, typeBuf, data, crcBuf]);
}

/**
 * Injects a tEXt chunk with keyword 'chronocard_state' immediately before IEND
 */
export function injectChronoCardChunk(pngBuffer: Buffer, payloadText: string): Buffer {
  const chunks = parsePngChunks(pngBuffer);

  // Format tEXt: keyword + null byte + text data
  const keywordBuf = Buffer.from(CHRONOCARD_KEYWORD, "latin1");
  const nullBuf = Buffer.from([0x00]);
  const textBuf = Buffer.from(payloadText, "latin1");
  const chunkData = Buffer.concat([keywordBuf, nullBuf, textBuf]);

  const newChunk = createPngChunk("tEXt", chunkData);

  // Build reconstructed PNG buffer
  const outParts: Buffer[] = [PNG_SIGNATURE];

  let injected = false;
  for (const chunk of chunks) {
    if (chunk.type === "IEND" && !injected) {
      outParts.push(newChunk);
      injected = true;
    }
    // Re-encode existing chunk
    outParts.push(createPngChunk(chunk.type, chunk.data));
  }

  if (!injected) {
    outParts.push(newChunk);
  }

  return Buffer.concat(outParts);
}

/**
 * Extracts ChronoCard payload string from PNG buffer
 */
export function extractChronoCardChunk(pngBuffer: Buffer): string | null {
  const chunks = parsePngChunks(pngBuffer);

  for (const chunk of chunks) {
    if (chunk.type === "tEXt") {
      // Find null separator
      const nullIdx = chunk.data.indexOf(0x00);
      if (nullIdx !== -1) {
        const keyword = chunk.data.subarray(0, nullIdx).toString("latin1");
        if (keyword === CHRONOCARD_KEYWORD || keyword === OCTOMEM_KEYWORD) {
          return chunk.data.subarray(nullIdx + 1).toString("latin1");
        }
      }
    }
  }

  return null;
}
