import type { Category } from "../categories";

export type Prediction = {
  productId: string;
  normalizedName: string;
  category: Category;
  averageConsumptionDays: number;
  lastPurchase: string;
  predictedRunOutDate: string;
  confidence: number;
  selected: boolean;
};
