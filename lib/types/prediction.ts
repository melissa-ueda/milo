import { Category } from "@/core/models/category";

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
