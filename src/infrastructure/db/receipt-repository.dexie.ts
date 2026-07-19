import type { ReceiptRepository } from "@/src/application/ports/receipt-repository";
import type { Receipt, ReceiptLine } from "@/src/domain/entities/receipt";
import { getDb } from "./dexie";
import {
  lineFromRow,
  lineToRow,
  receiptFromRow,
  receiptToRow,
} from "./records";

export function createReceiptRepository(): ReceiptRepository {
  const db = getDb();
  return {
    async add(receipt: Receipt, lines: ReceiptLine[]): Promise<void> {
      const image = await receipt.image.arrayBuffer();
      await db.transaction("rw", [db.receipts, db.receiptLines], async () => {
        await db.receipts.add(receiptToRow(receipt, image));
        await db.receiptLines.bulkAdd(lines.map(lineToRow));
      });
    },
    async getAll(): Promise<Receipt[]> {
      return (await db.receipts.orderBy("date").reverse().toArray()).map(
        receiptFromRow,
      );
    },
    async getLines(receiptId: string): Promise<ReceiptLine[]> {
      return (
        await db.receiptLines.where("receiptId").equals(receiptId).toArray()
      ).map(lineFromRow);
    },
    async getAllLines(): Promise<ReceiptLine[]> {
      return (await db.receiptLines.toArray()).map(lineFromRow);
    },
    async delete(receiptId: string): Promise<ReceiptLine[]> {
      return db.transaction("rw", [db.receipts, db.receiptLines], async () => {
        const rows = await db.receiptLines
          .where("receiptId")
          .equals(receiptId)
          .toArray();
        await db.receiptLines.where("receiptId").equals(receiptId).delete();
        await db.receipts.delete(receiptId);
        return rows.map(lineFromRow);
      });
    },
  };
}
