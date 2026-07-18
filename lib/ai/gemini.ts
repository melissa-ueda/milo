import { google } from '@ai-sdk/google';
import { generateObject } from 'ai';
import { z } from 'zod';
import { CATEGORY_LIST } from '../categories';
import { RECEIPT_SYSTEM_PROMPT } from './prompts';
import type { ParsedReceipt } from '../types';

const categorySchema = z.enum(CATEGORY_LIST as [string, ...string[]]);

const receiptSchema = z.object({
  store: z.string(),
  purchaseDate: z.string(),
  items: z.array(
    z.object({
      name: z.string(),
      normalizedName: z.string(),
      category: categorySchema,
      quantity: z.number(),
      unit: z.string(),
      price: z.number(),
      confidence: z.number(),
    }),
  ),
});

const DEFAULT_MODEL = 'gemini-3.1-flash-lite';

function getModelId(): string {
  return process.env.GEMINI_MODEL?.trim() || DEFAULT_MODEL;
}

export async function parseReceiptWithGemini(
  imageBuffer: Buffer,
  mimeType: string,
): Promise<ParsedReceipt> {
  const base64 = imageBuffer.toString('base64');
  const modelId = getModelId();

  const { object } = await generateObject({
    model: google(modelId),
    schema: receiptSchema,
    maxRetries: 1,
    messages: [
      {
        role: 'user',
        content: [
          { type: 'text', text: RECEIPT_SYSTEM_PROMPT },
          { type: 'image', image: `data:${mimeType};base64,${base64}` },
        ],
      },
    ],
  });

  return object as ParsedReceipt;
}

export function formatGeminiError(error: unknown): { message: string; status: number } {
  const raw = error instanceof Error ? error.message : 'Failed to parse receipt';
  const lower = raw.toLowerCase();

  if (lower.includes('quota') || lower.includes('rate limit') || lower.includes('429')) {
    return {
      message: `Gemini quota exceeded for ${getModelId()}. Try GEMINI_MODEL=gemini-2.5-flash-lite in .env.local, or check billing at ai.google.dev.`,
      status: 429,
    };
  }

  return { message: raw, status: 500 };
}
