import type { Deps } from "../deps";
import type { ParsedReceipt } from "@/src/domain/entities/receipt";

export type ParseReceiptResult = {
  receipt: ParsedReceipt;
  imageBlob: Blob;
};

/**
 * Compress a picked receipt photo and extract its lines via the AI provider.
 * Returns the parsed receipt for review plus the compressed blob to persist on
 * save. Throws if no API key is configured.
 */
export function parseReceipt(deps: Deps) {
  return async (file: File): Promise<ParseReceiptResult> => {
    if (!deps.ai.isConfigured()) {
      throw new Error(
        "Please configure your Gemini API Key first (under Household settings or in onboarding).",
      );
    }
    const imageBlob = await deps.images.compress(file);
    const receipt = await deps.ai.parseReceipt(imageBlob, imageBlob.type);
    return { receipt, imageBlob };
  };
}
