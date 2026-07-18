import { ParsedReceipt } from '../types/parsed-receipt';
import { compressImage } from './compress';
import { parseReceiptWithGemini } from '../ai/gemini';

export async function parseReceiptImage(
  file: File,
  apiKey: string,
): Promise<{ receipt: ParsedReceipt; imageBlob: Blob }> {
  const compressed = await compressImage(file);
  try {
    const receipt = await parseReceiptWithGemini(compressed, compressed.type, apiKey);
    return { receipt, imageBlob: compressed };
  } catch (error) {
    console.error('Receipt parsing failed:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to parse receipt');
  }
}

