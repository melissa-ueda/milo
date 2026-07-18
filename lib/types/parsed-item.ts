import type { Category } from "../categories";

export type ParsedItem = {
  name: string;
  normalizedName: string;
  category: Category;
  quantity: number;
  unit: string;
  price: number;
  confidence: number;
};
