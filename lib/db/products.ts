import { slugify } from "../slugify";
import type { Category } from "../categories";
import { db } from "./dexie";
import { ReceiptItemRecord } from "../types/receipt-item-record";
import { ProductRecord } from "../types/product-record";

export async function updateProductsFromReceipt(
  items: ReceiptItemRecord[],
  purchaseDate: string,
): Promise<void> {
  for (const item of items) {
    const productId = slugify(item.normalizedName);
    const existing = await db.products.get(productId);

    if (existing) {
      const prevDate = new Date(existing.lastPurchase);
      const newDate = new Date(purchaseDate);
      const daysBetween = Math.floor(
        (newDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24),
      );

      let avgDays = existing.averageConsumptionDays;
      if (daysBetween > 0 && daysBetween < 90) {
        avgDays =
          avgDays === null
            ? daysBetween
            : Math.round(
                (avgDays * existing.purchaseCount + daysBetween) /
                  (existing.purchaseCount + 1),
              );
      }

      await db.products.update(productId, {
        lastPurchase: purchaseDate,
        purchaseCount: existing.purchaseCount + 1,
        averageConsumptionDays: avgDays,
        category: item.category,
      });
    } else {
      await db.products.add({
        id: productId,
        normalizedName: item.normalizedName,
        category: item.category,
        averageConsumptionDays: null,
        lastPurchase: purchaseDate,
        purchaseCount: 1,
      });
    }
  }
}

export async function getAllProducts(): Promise<ProductRecord[]> {
  return db.products.toArray();
}

export async function getProduct(
  id: string,
): Promise<ProductRecord | undefined> {
  return db.products.get(id);
}

export async function updateProductCategory(
  id: string,
  category: Category,
): Promise<void> {
  await db.products.update(id, { category });
}
