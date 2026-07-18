import type { Category } from "../categories";

export type ProductRecord = {
  id: string;
  normalizedName: string;
  category: Category;
  averageConsumptionDays: number | null;
  lastPurchase: string;
  purchaseCount: number;
};
