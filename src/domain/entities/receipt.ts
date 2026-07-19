import type { Category } from "../taxonomy/category";
import type { ProductType } from "../taxonomy/product-type";
import type { IsoDate, IsoDateTime } from "../values/iso-date";
import type { Money } from "../values/money";

/** The record of one shopping trip. The receipt photo is kept for reference. */
export type Receipt = {
  readonly id: string;
  date: IsoDateTime;
  store: string;
  image: Blob;
};

/** One line on a receipt: what was bought, how much, and the price paid. */
export type ReceiptLine = {
  readonly id: string;
  readonly receiptId: string;
  name: string;
  type: ProductType;
  category: Category;
  quantity: number;
  unit: string;
  price: Money;
};

/**
 * A receipt freshly parsed from an image, before the user reviews and commits
 * it. Lines are un-persisted (`ParsedLine`); `confidence` reflects extraction
 * certainty and is dropped once saved.
 */
export type ParsedReceipt = {
  store: string;
  purchaseDate: IsoDate;
  lines: ParsedLine[];
};

export type ParsedLine = {
  name: string;
  normalizedName: string;
  type: ProductType;
  category: Category;
  quantity: number;
  unit: string;
  price: Money;
  confidence: number;
};

/** A parsed line carrying a stable id for editing in the review UI. */
export type ReviewLine = ParsedLine & { id: string };
