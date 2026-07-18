import type { Category } from "./category";
import type { Type } from "./type";

export type Product = {
  id: string;
  normalizedName: string;
  type: Type;
  category: Category;
  averageConsumptionDays: number | null;
  lastPurchase: string;
  purchaseCount: number;
  selected: boolean;
};
