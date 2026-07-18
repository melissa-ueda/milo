import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { generateObject } from "ai";
import { z } from "zod";
import { PREDICTION_SYSTEM_PROMPT, RECEIPT_SYSTEM_PROMPT } from "./prompts";
import type { ParsedReceipt } from "@/core/models/parsed";
import { CATEGORY_LIST } from "@/core/models/category";
import { TYPE_LIST } from "@/core/models/type";
import type { Household } from "@/core/models/household";

const typeSchema = z.enum(TYPE_LIST as [string, ...string[]]);
const categorySchema = z.enum(CATEGORY_LIST as [string, ...string[]]);

const receiptSchema = z.object({
  store: z.string(),
  purchaseDate: z.string(),
  items: z.array(
    z.object({
      name: z.string(),
      normalizedName: z.string(),
      type: typeSchema,
      category: categorySchema,
      quantity: z.number(),
      unit: z.string(),
      price: z.number(),
      confidence: z.number(),
    }),
  ),
});

const predictionSchema = z.object({
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

const DEFAULT_MODEL = "gemini-3.1-flash-lite";

export async function parseReceiptWithGemini(
  imageBlob: Blob,
  mimeType: string,
  apiKey: string,
): Promise<ParsedReceipt> {
  const base64DataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(imageBlob);
  });

  const google = createGoogleGenerativeAI({
    apiKey,
  });

  const modelId = DEFAULT_MODEL;

  const { object } = await generateObject({
    model: google(modelId),
    schema: receiptSchema,
    maxRetries: 1,
    messages: [
      {
        role: "user",
        content: [
          { type: "text", text: RECEIPT_SYSTEM_PROMPT },
          { type: "image", image: base64DataUrl },
        ],
      },
    ],
  });

  return object as ParsedReceipt;
}

export type PredictionInput = {
  normalizedName: string;
  category: string;
  purchaseDates: string[];
  lastPurchase: string;
  purchaseCount: number;
};

export type GeminiPrediction = z.infer<
  typeof predictionSchema
>["predictions"][number];

export async function predictWithGemini(
  household: Household,
  products: PredictionInput[],
  today: string,
  nextShoppingDate: string,
  apiKey: string,
): Promise<GeminiPrediction[]> {
  const google = createGoogleGenerativeAI({ apiKey });
  const { object } = await generateObject({
    model: google(DEFAULT_MODEL),
    schema: predictionSchema,
    maxRetries: 1,
    messages: [
      {
        role: "user",
        content: `${PREDICTION_SYSTEM_PROMPT}\n\nToday: ${today}\nNext likely shopping date: ${nextShoppingDate}\nHousehold profile:\n${JSON.stringify(household)}\nKnown products and purchase history:\n${JSON.stringify(products)}`,
      },
    ],
  });

  return object.predictions;
}

export function formatGeminiError(error: unknown): {
  message: string;
  status: number;
} {
  const raw =
    error instanceof Error ? error.message : "Failed to parse receipt";
  const lower = raw.toLowerCase();

  if (
    lower.includes("quota") ||
    lower.includes("rate limit") ||
    lower.includes("429")
  ) {
    return {
      message: `Gemini quota exceeded. Please check your billing or quota at ai.google.dev.`,
      status: 429,
    };
  }

  return { message: raw, status: 500 };
}
