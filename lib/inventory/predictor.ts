import { categoryEmoji } from '../categories';
import type { Prediction, ProductRecord } from '../types';
import { db } from '../db/dexie';

let cachedPredictions: Prediction[] = [];

export async function recalculatePredictions(): Promise<Prediction[]> {
  const products = await db.products.toArray();
  const now = new Date();

  cachedPredictions = products
    .filter(p => p.averageConsumptionDays !== null && p.purchaseCount >= 2)
    .map(p => buildPrediction(p, now))
    .sort(
      (a, b) =>
        new Date(a.predictedRunOutDate).getTime() - new Date(b.predictedRunOutDate).getTime(),
    );

  return cachedPredictions;
}

function buildPrediction(product: ProductRecord, now: Date): Prediction {
  const lastPurchase = new Date(product.lastPurchase);
  const daysSince = Math.floor(
    (now.getTime() - lastPurchase.getTime()) / (1000 * 60 * 60 * 24),
  );
  const avgDays = product.averageConsumptionDays!;
  const daysUntilRunOut = Math.max(0, avgDays - daysSince);

  const runOutDate = new Date(now);
  runOutDate.setDate(runOutDate.getDate() + daysUntilRunOut);

  const confidence = Math.min(96, 50 + product.purchaseCount * 8);

  return {
    productId: product.id,
    normalizedName: product.normalizedName,
    category: product.category,
    averageConsumptionDays: avgDays,
    lastPurchase: product.lastPurchase,
    predictedRunOutDate: runOutDate.toISOString(),
    confidence,
    selected: daysUntilRunOut <= 7,
  };
}

export async function getPredictions(): Promise<Prediction[]> {
  if (cachedPredictions.length === 0) {
    return recalculatePredictions();
  }
  return cachedPredictions;
}

export function predictionToDisplayItem(prediction: Prediction) {
  const runOut = new Date(prediction.predictedRunOutDate);
  const daysUntil = Math.ceil(
    (runOut.getTime() - Date.now()) / (1000 * 60 * 60 * 24),
  );

  let status: 'Soon' | 'This week' | 'Later' = 'Later';
  if (daysUntil <= 2) status = 'Soon';
  else if (daysUntil <= 7) status = 'This week';

  const dueDay = runOut.toLocaleDateString('en-US', { weekday: 'long' });

  return {
    name: prediction.normalizedName,
    emoji: categoryEmoji[prediction.category],
    amount: '1',
    remaining: daysUntil <= 0 ? 'Likely empty' : `About ${Math.max(1, Math.round((1 - daysUntil / prediction.averageConsumptionDays) * 100))}% used`,
    due: daysUntil <= 0 ? 'Now' : dueDay,
    confidence: prediction.confidence,
    cadence: `Usually every ${prediction.averageConsumptionDays} days`,
    status,
    selected: prediction.selected,
  };
}

export function getNextShopLikelihood(): { likely: boolean; confidence: number; day: string } {
  const soonItems = cachedPredictions.filter(p => {
    const daysUntil = Math.ceil(
      (new Date(p.predictedRunOutDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24),
    );
    return daysUntil <= 3;
  });

  const confidence = soonItems.length > 0 ? Math.min(92, 60 + soonItems.length * 8) : 40;
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const day = tomorrow.toLocaleDateString('en-US', { weekday: 'long' });

  return { likely: soonItems.length >= 2, confidence, day };
}
