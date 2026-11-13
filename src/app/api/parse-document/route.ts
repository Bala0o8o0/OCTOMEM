import { NextRequest, NextResponse } from "next/server";
import { parseDocumentBuffer } from "@/lib/ai/document-parser";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const fileName = file.name;
    const fileType = file.type || "application/octet-stream";
    const extension = fileName.split(".").pop()?.toLowerCase() || "";
    const buffer = Buffer.from(await file.arrayBuffer());

    const { text, pageCount } = await parseDocumentBuffer(buffer, fileName, fileType);

    return NextResponse.json({
      success: true,
      fileName,
      fileType,
      extension,
      size: file.size,
      text,
      charCount: text.length,
      pageCount,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to extract text from document";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
