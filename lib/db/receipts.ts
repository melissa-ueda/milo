import { slugify } from "../slugify";
import { db } from "./dexie";
import { updateProductsFromReceipt } from "./products";
import { recalculatePredictions } from "../inventory/predictor";
import { ReviewItem } from "../types/review-item";

export async function saveReceipt(
  store: string,
  purchaseDate: string,
  imageBlob: Blob,
  items: ReviewItem[],
): Promise<string> {
  const receiptId = crypto.randomUUID();

  await db.transaction(
    "rw",
    [db.receipts, db.receiptItems, db.products],
    async () => {
      await db.receipts.add({
        id: receiptId,
        date: purchaseDate,
        store,
        image: imageBlob,
      });

      const receiptItems = items.map((item) => ({
        id: crypto.randomUUID(),
        receiptId,
        normalizedName: item.normalizedName,
        category: item.category,
        quantity: item.quantity,
        unit: item.unit,
        price: item.price,
      }));

      await db.receiptItems.bulkAdd(receiptItems);
      await updateProductsFromReceipt(receiptItems, purchaseDate);
    },
  );

  await recalculatePredictions();
  return receiptId;
}

export async function getAllReceipts() {
  return db.receipts.orderBy("date").reverse().toArray();
}

export async function getReceiptItems(receiptId: string) {
  return db.receiptItems.where("receiptId").equals(receiptId).toArray();
}

export async function deleteReceipt(receiptId: string) {
  await db.transaction("rw", [db.receipts, db.receiptItems], async () => {
    await db.receiptItems.where("receiptId").equals(receiptId).delete();
    await db.receipts.delete(receiptId);
  });
  await recalculatePredictions();
}

export function toReviewItems(
  items: Array<{
    name: string;
    normalizedName: string;
    category: ReviewItem["category"];
    quantity: number;
    unit: string;
    price: number;
    confidence: number;
  }>,
): ReviewItem[] {
  return items.map((item) => ({
    ...item,
    id: slugify(item.normalizedName),
  }));
}

export function formatReceiptDate(isoDate: string): string {
  const date = new Date(isoDate);
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function formatCurrency(amount: number): string {
  return `€${amount.toFixed(2)}`;
}
