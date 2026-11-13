/**
 * Converts any user-uploaded image (JPG, PNG, WebP, AVIF) into a standardized
 * PNG Base64 string using an HTML5 offscreen canvas in the browser.
 */
export function convertImageToPngBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.naturalWidth || 640;
        canvas.height = img.naturalHeight || 400;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Unable to create 2D canvas context"));
          return;
        }
        ctx.drawImage(img, 0, 0);
        // Generates standard image/png data URL
        const pngDataUrl = canvas.toDataURL("image/png");
        resolve(pngDataUrl);
      };
      img.onerror = () => reject(new Error("Corrupted or unsupported image file."));
      img.src = e.target?.result as string;
    };
    reader.onerror = () => reject(new Error("Failed to read image file from disk."));
    reader.readAsDataURL(file);
  });
}
