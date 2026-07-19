import { z } from "zod";

/**
 * Structured-output schemas for Gemini. `type`/`category` are accepted as free
 * strings here and normalized to domain codes in the provider (tolerant to the
 * model returning a label or synonym), rather than a strict enum that would
 * reject the whole response on one drift.
 */
export const receiptSchema = z.object({
  store: z.string(),
  purchaseDate: z.string(),
  items: z.array(
    z.object({
      name: z.string(),
      normalizedName: z.string(),
      type: z.string(),
      category: z.string(),
      quantity: z.number(),
      unit: z.string(),
      price: z.number(),
      confidence: z.number().min(0).max(100),
    }),
  ),
});

export const predictionSchema = z.object({
  predictions: z.array(
    z.object({
      normalizedName: z.string(),
      averageConsumptionDays: z.number().int().min(1).max(120),
      predictedRunOutDate: z.string(),
      confidence: z.number().int().min(0).max(100),
      selected: z.boolean(),
    }),
  ),
});

export type ReceiptSchemaItem = z.infer<typeof receiptSchema>["items"][number];
export type PredictionSchemaItem = z.infer<
  typeof predictionSchema
>["predictions"][number];
