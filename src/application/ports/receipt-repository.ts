import type { Receipt, ReceiptLine } from "@/src/domain/entities/receipt";

/** Persistence for receipts and their lines. */
export type ReceiptRepository = {
  /** Atomically store a receipt and its lines. */
  add(receipt: Receipt, lines: ReceiptLine[]): Promise<void>;
  /** Receipts newest-first. */
  getAll(): Promise<Receipt[]>;
  getLines(receiptId: string): Promise<ReceiptLine[]>;
  /** All lines across all receipts (for recomputing staple history). */
  getAllLines(): Promise<ReceiptLine[]>;
  /** Delete a receipt and its lines; returns the removed lines. */
  delete(receiptId: string): Promise<ReceiptLine[]>;
};
