import type { Category } from "./category";
import type { Type } from "./type";

export type ParsedItem = {
  name: string;
  normalizedName: string;
  type: Type;
  category: Category;
  quantity: number;
  unit: string;
  price: number;
  confidence: number;
};

export type ParsedReceipt = {
  store: string;
  purchaseDate: string;
  items: ParsedItem[];
};

export type ReviewItem = ParsedItem & { id: string };
