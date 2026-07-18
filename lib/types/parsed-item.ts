import { Category } from "@/core/models/category";
import { Type } from "@/core/models/type";

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
