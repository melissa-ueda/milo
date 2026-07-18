import type { Category } from "../categories";

export type ReceiptItemRecord = {
  id: string;
  receiptId: string;
  normalizedName: string;
  category: Category;
  quantity: number;
  unit: string;
  price: number;
};
