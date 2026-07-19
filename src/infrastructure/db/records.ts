import type { PantryStaple } from "@/src/domain/entities/pantry-staple";
import type { Receipt, ReceiptLine } from "@/src/domain/entities/receipt";
import type { AppSettings } from "@/src/domain/entities/settings";
import { asCategory } from "@/src/domain/taxonomy/category";
import { asProductType } from "@/src/domain/taxonomy/product-type";
import { money, toMajor } from "@/src/domain/values/money";
import { asStapleId } from "@/src/domain/values/staple-id";

/**
 * IndexedDB row shapes and their mappers to/from domain entities. Rows are flat
 * and store only machine codes + primitives; branded/nested domain types are
 * reconstructed on read.
 */

export type StapleRow = {
  id: string;
  name: string;
  matchKey: string;
  type: string;
  category: string;
  avgDays: number | null;
  lastPurchase: string;
  purchaseCount: number;
  selected: boolean;
};

export type ReceiptRow = {
  id: string;
  date: string;
  store: string;
  /** ArrayBuffer is more reliably persisted than Blob on iOS Safari. */
  image: ArrayBuffer | Blob;
  imageType?: string;
};

export type ReceiptLineRow = {
  id: string;
  receiptId: string;
  name: string;
  type: string;
  category: string;
  quantity: number;
  unit: string;
  priceCents: number;
  currency: string;
};

export type SettingsRow = {
  id: "app";
  household: AppSettings["household"];
  geminiApiKey: string;
  onboarded: boolean;
};

export function stapleToRow(s: PantryStaple): StapleRow {
  return {
    id: s.id,
    name: s.name,
    matchKey: s.matchKey,
    type: s.type,
    category: s.category,
    avgDays: s.rhythm.avgDays,
    lastPurchase: s.rhythm.lastPurchase,
    purchaseCount: s.rhythm.purchaseCount,
    selected: s.selected,
  };
}

export function stapleFromRow(r: StapleRow): PantryStaple {
  return {
    id: asStapleId(r.id),
    name: r.name,
    matchKey: r.matchKey,
    type: asProductType(r.type),
    category: asCategory(r.category),
    rhythm: {
      avgDays: r.avgDays,
      lastPurchase: r.lastPurchase,
      purchaseCount: r.purchaseCount,
    },
    selected: r.selected,
  };
}

export function receiptToRow(r: Receipt, image: ArrayBuffer): ReceiptRow {
  return {
    id: r.id,
    date: r.date,
    store: r.store,
    image,
    imageType: r.image.type,
  };
}

export function receiptFromRow(r: ReceiptRow): Receipt {
  const image =
    r.image instanceof Blob
      ? r.image
      : new Blob([r.image], { type: r.imageType ?? "image/jpeg" });
  return { id: r.id, date: r.date, store: r.store, image };
}

export function lineToRow(l: ReceiptLine): ReceiptLineRow {
  return {
    id: l.id,
    receiptId: l.receiptId,
    name: l.name,
    type: l.type,
    category: l.category,
    quantity: l.quantity,
    unit: l.unit,
    priceCents: l.price.cents,
    currency: l.price.currency,
  };
}

export function lineFromRow(r: ReceiptLineRow): ReceiptLine {
  return {
    id: r.id,
    receiptId: r.receiptId,
    name: r.name,
    type: asProductType(r.type),
    category: asCategory(r.category),
    quantity: r.quantity,
    unit: r.unit,
    price: money(r.priceCents, r.currency),
  };
}

/** Kept for symmetry / potential debugging of legacy numeric prices. */
export function euros(cents: number): number {
  return toMajor(money(cents));
}
