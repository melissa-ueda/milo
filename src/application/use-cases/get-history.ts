import type { Deps } from "../deps";
import type { Receipt, ReceiptLine } from "@/src/domain/entities/receipt";

export type PurchaseRecord = {
  receipt: Receipt;
  lines: ReceiptLine[];
};

/** Load receipt history (newest first) with each receipt's lines. */
export function getHistory(deps: Deps) {
  return async (): Promise<PurchaseRecord[]> => {
    const receipts = await deps.receipts.getAll();
    return Promise.all(
      receipts.map(async (receipt) => ({
        receipt,
        lines: await deps.receipts.getLines(receipt.id),
      })),
    );
  };
}
