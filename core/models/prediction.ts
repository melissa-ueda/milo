import type { Category } from "./category";
import type { Type } from "./type";

export type Prediction = {
  productId: string;
  normalizedName: string;
  category: Category;
  type: Type;
  averageConsumptionDays: number;
  lastPurchase: string;
  predictedRunOutDate: string;
  confidence: number;
  selected: boolean;
};
