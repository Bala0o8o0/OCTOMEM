import { NextRequest, NextResponse } from "next/server";
import { extractChronoCardChunk } from "@/lib/png/chunk";
import { unpackEnvelope } from "@/lib/crypto/envelope";

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const passphrase = (formData.get("passphrase") as string | null) || undefined;

    if (!file) {
      return NextResponse.json(
        { success: false, error: "No file provided in form data." },
        { status: 400 }
      );
    }

    // Enforce 10 MB upload cap
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { success: false, error: "Uploaded file exceeds 10MB limit." },
        { status: 413 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Extract ChronoCard chunk
    const rawChunkData = extractChronoCardChunk(buffer);
    if (!rawChunkData) {
      return NextResponse.json(
        {
          success: false,
          error: "Not a valid ChronoCard: No 'chronocard_state' ancillary metadata chunk found.",
        },
        { status: 422 }
      );
    }

    // Unpack envelope
    const unpackResult = unpackEnvelope(rawChunkData, passphrase);

    if (!unpackResult.success) {
      if (unpackResult.requiresPassphrase) {
        return NextResponse.json(
          {
            success: false,
            requiresPassphrase: true,
            error: unpackResult.error,
          },
          { status: 401 }
        );
      }
      return NextResponse.json(
        {
          success: false,
          error: unpackResult.error,
        },
        { status: 403 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        payload: unpackResult.payload,
      },
      { status: 200 }
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal error parsing card";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
