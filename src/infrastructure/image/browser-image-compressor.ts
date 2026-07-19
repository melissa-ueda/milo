import imageCompression from "browser-image-compression";
import type { ImageCompressor } from "@/src/application/ports/image-compressor";

/** Compresses a picked photo to a JPEG ≤ 1500px using a web worker. */
export const browserImageCompressor: ImageCompressor = {
  async compress(file: File): Promise<Blob> {
    return imageCompression(file, {
      maxWidthOrHeight: 1500,
      useWebWorker: true,
      fileType: "image/jpeg",
      initialQuality: 0.78,
    });
  },
};
