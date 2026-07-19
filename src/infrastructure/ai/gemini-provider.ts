import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { generateObject } from "ai";
import type {
  AIPrediction,
  AIProvider,
  PredictionInput,
  PredictionWindow,
} from "@/src/application/ports/ai-provider";
import type { Household } from "@/src/domain/entities/household";
import type { ParsedLine, ParsedReceipt } from "@/src/domain/entities/receipt";
import { asCategory } from "@/src/domain/taxonomy/category";
import { asProductType } from "@/src/domain/taxonomy/product-type";
import { fromMajor } from "@/src/domain/values/money";
import { mapAiError } from "./error-mapping";
import { PREDICTION_SYSTEM_PROMPT, RECEIPT_SYSTEM_PROMPT } from "./prompts";
import { predictionSchema, receiptSchema } from "./schemas";

const DEFAULT_MODEL = "gemini-3.1-flash-lite";

/** Tolerantly turn a model-emitted label/synonym into a domain code shape. */
function normalizeCode(raw: string): string {
  return raw
    .trim()
    .toLowerCase()
    .replace(/[\s-]+/g, "_");
}

async function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

export type GeminiProviderConfig = {
  /** Read the current API key lazily (it can change in settings). */
  getApiKey: () => string;
  model?: string;
};

export function createGeminiProvider(config: GeminiProviderConfig): AIProvider {
  const model = config.model ?? DEFAULT_MODEL;

  return {
    isConfigured(): boolean {
      return config.getApiKey().trim().length > 0;
    },

    async parseReceipt(
      image: Blob,
      _mimeType: string,
      signal?: AbortSignal,
    ): Promise<ParsedReceipt> {
      try {
        const dataUrl = await blobToDataUrl(image);
        const google = createGoogleGenerativeAI({ apiKey: config.getApiKey() });
        const { object } = await generateObject({
          model: google(model),
          schema: receiptSchema,
          maxRetries: 1,
          abortSignal: signal,
          messages: [
            {
              role: "user",
              content: [
                { type: "text", text: RECEIPT_SYSTEM_PROMPT },
                { type: "image", image: dataUrl },
              ],
            },
          ],
        });

        const lines: ParsedLine[] = object.items.map((item) => ({
          name: item.name,
          normalizedName: item.normalizedName,
          type: asProductType(normalizeCode(item.type)),
          category: asCategory(normalizeCode(item.category)),
          quantity: item.quantity,
          unit: item.unit,
          price: fromMajor(item.price),
          confidence: item.confidence,
        }));

        return {
          store: object.store,
          purchaseDate: object.purchaseDate,
          lines,
        };
      } catch (error) {
        throw mapAiError(error);
      }
    },

    async predict(
      household: Household,
      inputs: PredictionInput[],
      window: PredictionWindow,
    ): Promise<AIPrediction[]> {
      try {
        const google = createGoogleGenerativeAI({ apiKey: config.getApiKey() });
        const { object } = await generateObject({
          model: google(model),
          schema: predictionSchema,
          maxRetries: 1,
          messages: [
            {
              role: "user",
              content: `${PREDICTION_SYSTEM_PROMPT}\n\nToday: ${window.today}\nNext likely shopping date: ${window.nextShop}\nHousehold profile:\n${JSON.stringify(household)}\nKnown products and purchase history:\n${JSON.stringify(inputs)}`,
            },
          ],
        });

        return object.predictions.map((p) => ({
          name: p.normalizedName,
          averageConsumptionDays: p.averageConsumptionDays,
          predictedRunOutDate: p.predictedRunOutDate,
          confidence: p.confidence,
          selected: p.selected,
        }));
      } catch (error) {
        throw mapAiError(error);
      }
    },
  };
}
