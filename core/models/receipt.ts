import type { Category } from "./category";
import type { Type } from "./type";

export type Receipt = { id: string; date: string; store: string; image: Blob };
export type ReceiptItem = {
  id: string;
  receiptId: string;
  normalizedName: string;
  type: Type;
  category: Category;
  quantity: number;
  unit: string;
  price: number;
};
