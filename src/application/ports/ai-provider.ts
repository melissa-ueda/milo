import type { Household } from "@/src/domain/entities/household";
import type { ParsedReceipt } from "@/src/domain/entities/receipt";
import type { Category } from "@/src/domain/taxonomy/category";
import type { ProductType } from "@/src/domain/taxonomy/product-type";

/** Purchase history for one staple, sent to the AI for forecasting. */
export type PredictionInput = {
  name: string;
  type: ProductType;
  category: Category;
  purchaseDates: string[];
  lastPurchase: string;
  purchaseCount: number;
};

/** One AI-produced forecast, keyed back to a staple by `name`. */
export type AIPrediction = {
  name: string;
  averageConsumptionDays: number;
  predictedRunOutDate: string;
  confidence: number;
  selected: boolean;
};

export type PredictionWindow = {
  today: string;
  nextShop: string;
};

/**
 * The AI capability Milo needs, as a port. The API key is bound inside the
 * concrete adapter — callers never pass it. `isConfigured()` reports whether a
 * key is present so use-cases can decide between the AI and local strategies.
 */
export type AIProvider = {
  isConfigured(): boolean;
  parseReceipt(
    image: Blob,
    mimeType: string,
    signal?: AbortSignal,
  ): Promise<ParsedReceipt>;
  predict(
    household: Household,
    inputs: PredictionInput[],
    window: PredictionWindow,
  ): Promise<AIPrediction[]>;
};
