import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { generateObject } from "ai";
import { z } from "zod";
import { RECEIPT_SYSTEM_PROMPT } from "./prompts";
import { ParsedReceipt } from "../types/parsed-receipt";
import { CATEGORY_LIST } from "@/core/models/category";
import { TYPE_LIST } from "@/core/models/type";

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

const DEFAULT_MODEL = "gemini-2.5-flash";

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
