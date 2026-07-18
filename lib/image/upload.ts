import { ParsedReceipt } from '../types/parsed-receipt';
import { compressImage } from './compress';

export async function parseReceiptImage(file: File): Promise<{ receipt: ParsedReceipt; imageBlob: Blob }> {
  const compressed = await compressImage(file);
  const formData = new FormData();
  formData.append('image', compressed, compressed.name);

  const response = await fetch('/api/receipt', {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Failed to parse receipt' }));
    throw new Error(error.error ?? 'Failed to parse receipt');
  }

  const receipt: ParsedReceipt = await response.json();
  return { receipt, imageBlob: compressed };
}
