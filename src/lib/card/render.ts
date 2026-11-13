import zlib from "zlib";
import { createPngChunk } from "../png/chunk";

const PNG_SIGNATURE = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

/**
 * Generates a sleek, 100% native Apple-slate styled base PNG image (640x400)
 * Uses pure Node.js zlib without any external binary or C++ dependencies.
 */
export function generateBaseCardPng(
  width = 640,
  height = 400,
  accentColor: "blue" | "emerald" | "amber" = "blue"
): Buffer {
  // Row size = 1 filter byte + (width * 4 RGBA bytes)
  const rowBytes = 1 + width * 4;
  const rawData = Buffer.alloc(rowBytes * height);

  // RGB accents
  const accents = {
    blue: [10, 132, 255],
    emerald: [48, 209, 88],
    amber: [255, 159, 10],
  };
  const [accentR, accentG, accentB] = accents[accentColor] || accents.blue;

  for (let y = 0; y < height; y++) {
    const rowOffset = y * rowBytes;
    rawData[rowOffset] = 0; // Filter: 0 (None)

    // Vertical gradient: top is slate-900 (24, 28, 44), bottom is deep obsidian (8, 10, 16)
    const factor = y / height;
    const baseR = Math.round(24 * (1 - factor) + 8 * factor);
    const baseG = Math.round(28 * (1 - factor) + 10 * factor);
    const baseB = Math.round(44 * (1 - factor) + 16 * factor);

    for (let x = 0; x < width; x++) {
      const pxOffset = rowOffset + 1 + x * 4;

      let r = baseR;
      let g = baseG;
      let b = baseB;
      let a = 255;

      // 1px Subtle Apple Chamfer Border (inset by 12px)
      const isBorder =
        (x === 12 || x === width - 13) && y >= 12 && y <= height - 13 ||
        (y === 12 || y === height - 13) && x >= 12 && x <= width - 13;

      // Top Header Accent Bar (y = 56)
      const isAccentLine = y === 56 && x >= 24 && x <= width - 24;

      // Center Medallion Plate (y between 120 and 280, x between 180 and 460)
      const isInnerPlate =
        x >= 160 && x <= width - 160 && y >= 110 && y <= height - 110;
      const isInnerBorder =
        (x === 160 || x === width - 160) && y >= 110 && y <= height - 110 ||
        (y === 110 || y === height - 110) && x >= 160 && x <= width - 160;

      if (isBorder) {
        r = 60;
        g = 70;
        b = 90;
      } else if (isAccentLine) {
        r = accentR;
        g = accentG;
        b = accentB;
      } else if (isInnerBorder) {
        r = 50;
        g = 60;
        b = 80;
      } else if (isInnerPlate) {
        r = Math.min(255, r + 8);
        g = Math.min(255, g + 8);
        b = Math.min(255, b + 14);
      }

      rawData[pxOffset] = r;
      rawData[pxOffset + 1] = g;
      rawData[pxOffset + 2] = b;
      rawData[pxOffset + 3] = a;
    }
  }

  // Compress raw scanlines with Deflate (zlib)
  const compressedData = zlib.deflateSync(rawData, { level: 9 });

  // 1. IHDR Chunk
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData[8] = 8; // Bit depth: 8
  ihdrData[9] = 6; // Color type: 6 (RGBA)
  ihdrData[10] = 0; // Compression method: 0 (deflate)
  ihdrData[11] = 0; // Filter method: 0 (standard)
  ihdrData[12] = 0; // Interlace method: 0 (no interlace)
  const ihdrChunk = createPngChunk("IHDR", ihdrData);

  // 2. IDAT Chunk
  const idatChunk = createPngChunk("IDAT", compressedData);

  // 3. IEND Chunk
  const iendChunk = createPngChunk("IEND", Buffer.alloc(0));

  return Buffer.concat([PNG_SIGNATURE, ihdrChunk, idatChunk, iendChunk]);
}
