import { Category } from "@/core/models/category";
import { Type } from "@/core/models/type";

export type ProductRecord = {
  id: string;
  normalizedName: string;
  type: Type;
  category: Category;
  averageConsumptionDays: number | null;
  lastPurchase: string;
  purchaseCount: number;
};
