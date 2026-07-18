import { Category } from "@/core/models/category";
import { Type } from "@/core/models/type";

export type ReceiptItemRecord = {
  id: string;
  receiptId: string;
  normalizedName: string;
  type: Type;
  category: Category;
  quantity: number;
  unit: string;
  price: number;
};
