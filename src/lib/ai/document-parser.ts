import mammoth from "mammoth";

export async function parseDocumentBuffer(
  buffer: Buffer,
  fileName: string,
  contentType?: string
): Promise<{ text: string; pageCount?: number }> {
  const extension = fileName.split(".").pop()?.toLowerCase() || "";

  if (extension === "docx") {
    const res = await mammoth.extractRawText({ buffer });
    return { text: res.value.trim() };
  }

  if (extension === "pdf") {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const pdfModule = require("pdf-parse");
    const PDFClass = pdfModule.PDFParse || pdfModule.default || pdfModule;
    if (typeof PDFClass === "function") {
      const parser = new PDFClass({ data: buffer });
      const res = await parser.getText();
      if (typeof parser.destroy === "function") {
        await parser.destroy();
      }
      return {
        text: (res?.text || "").trim(),
        pageCount: res?.total || res?.pages?.length,
      };
    }
  }

  // Text, JSON, Markdown, CSV, Code files
  return { text: buffer.toString("utf-8").trim() };
}
