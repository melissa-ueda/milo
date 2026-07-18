import { slugify } from "../slugify";
import { db } from "./dexie";
import type { ReceiptItem } from "@/core/models/receipt";
import { Category } from "@/core/models/category";
import { Type } from "@/core/models/type";

export async function updateProductsFromReceipt(
  items: ReceiptItem[],
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
        type: item.type,
        category: item.category,
        averageConsumptionDays: null,
        lastPurchase: purchaseDate,
        purchaseCount: 1,
        selected: true,
      });
    }
  }
}

export async function addManualProduct(input: {
  name: string;
  type?: Type;
  category?: Category;
}): Promise<void> {
  const normalizedName = input.name.trim().toLowerCase();
  if (!normalizedName) return;
  const id = slugify(normalizedName);
  const existing = await db.products.get(id);
  if (existing) {
    await db.products.update(id, {
      lastPurchase: new Date().toISOString(),
      purchaseCount: existing.purchaseCount + 1,
      selected: true,
    });
    return;
  }
  await db.products.put({
    id,
    normalizedName: input.name.trim(),
    type: input.type || ("other" as Type),
    category: input.category || "other",
    averageConsumptionDays: null,
    lastPurchase: new Date().toISOString(),
    purchaseCount: 1,
    selected: true,
  });
}

export async function setProductSelected(
  id: string,
  selected: boolean,
): Promise<void> {
  await db.products.update(id, { selected });
}
