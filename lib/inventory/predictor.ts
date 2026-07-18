import { categoryEmoji } from "../categories";
import type { Prediction } from "../types/prediction";
import { db } from "../db/dexie";
import { Household } from "../types/household";
import { Category } from "@/core/models/category";

let cachedPredictions: Prediction[] = [];

/**
 * Calculates a baseline consumption interval (prior) for a product category
 * adjusted according to the household settings (size, pets, cooking frequency, shopping cadence).
 */
function getPriorInterval(category: Category, household: Household): number {
  // 1. Base interval (in days) for a standard baseline household (2 adults, 0 children, 1 pet, normal cooking)
  const categoryBaselines: Record<Category, number> = {
    bread: 4,
    dairy: 5,
    fruit: 6,
    vegetable: 6,
    meat: 6,
    fish: 6,
    beverage: 7,
    snack: 8,
    pantry: 20,
    cleaning: 30,
    personalCare: 25,
    household: 25,
    baby: 7,
    pet: 10,
    other: 12,
  };

  const base = categoryBaselines[category] || 10;

  // 2. Household size scaling
  // Adults + children (weighted 0.5)
  // Let's assume baseline is 2 adults (size 2)
  const householdSize =
    (household.adults || 2) + (household.children || 0) * 0.5;
  const sizeFactor = Math.max(0.5, householdSize / 2);

  // 3. Pet scaling (only affects pet category)
  let petFactor = 1.0;
  if (category === "pet") {
    // baseline is 1 pet
    petFactor = Math.max(0.5, (household.pets || 1) / 1);
  }

  // 4. Cooking frequency scaling (only affects cooking-related food categories)
  let cookingFactor = 1.0;
  if (["vegetable", "meat", "fish", "pantry", "dairy"].includes(category)) {
    if (household.cooking === "Most days") {
      cookingFactor = 1.3; // Consumed 30% faster (shorter interval)
    } else if (household.cooking === "Rarely") {
      cookingFactor = 0.6; // Consumed 40% slower (longer interval)
    }
  }

  // 5. Cadence factor
  let cadenceFactor = 1.0;
  if (household.cadence === "Weekly") {
    cadenceFactor = 0.9;
  } else if (household.cadence === "Every 10 days") {
    cadenceFactor = 1.0;
  } else if (household.cadence === "Every two weeks") {
    cadenceFactor = 1.25;
  }

  // Combine scaling factors
  // Consumption rate is proportional to sizeFactor * cookingFactor * petFactor
  // Interval is inversely proportional to consumption rate.
  let scale = sizeFactor * cookingFactor * cadenceFactor;
  if (category === "pet") {
    scale = petFactor * cadenceFactor;
  }

  // Safety bounds to prevent division by zero or extreme intervals
  scale = Math.max(0.2, Math.min(5.0, scale));

  const interval = base / scale;

  // Round to nearest day, minimum 1 day
  return Math.max(1, Math.round(interval));
}

function getCadenceDays(cadence: string): number {
  switch (cadence) {
    case "Weekly":
      return 7;
    case "Every 10 days":
      return 10;
    case "Every two weeks":
      return 14;
    case "It varies":
    default:
      return 7;
  }
}

/**
 * Helper to calculate the next expected shopping day and the one after that
 */
function getNextShoppingDates(
  now: Date,
  shoppingDay: string,
  cadenceDays: number,
): { nextShop: Date; nextShopAfter: Date } {
  const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const dayIndex = daysOfWeek.indexOf(shoppingDay);

  const nextShop = new Date(now);
  nextShop.setHours(0, 0, 0, 0);

  if (dayIndex !== -1) {
    const currentDayIndex = now.getDay();
    let daysUntil = dayIndex - currentDayIndex;
    if (daysUntil <= 0) {
      daysUntil += 7; // Next occurrence
    }
    nextShop.setDate(now.getDate() + daysUntil);
  } else {
    // If no usual day, assume next shop is in cadenceDays / 2
    nextShop.setDate(now.getDate() + Math.max(1, Math.round(cadenceDays / 2)));
  }

  const nextShopAfter = new Date(nextShop);
  nextShopAfter.setDate(nextShop.getDate() + cadenceDays);

  return { nextShop, nextShopAfter };
}

export async function recalculatePredictions(
  household?: Household,
): Promise<Prediction[]> {
  // Load household settings
  let activeHousehold = household;
  if (!activeHousehold && typeof window !== "undefined") {
    const saved = window.localStorage.getItem("milo-household");
    if (saved) {
      try {
        activeHousehold = JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse household settings in predictor", e);
      }
    }
  }

  // Fallback defaults if not found
  if (!activeHousehold) {
    activeHousehold = {
      name: "",
      adults: 2,
      children: 0,
      pets: 1,
      cadence: "Weekly",
      day: "Friday",
      cooking: "Most days",
      preferences: "No preferences",
    };
  }

  const products = await db.products.toArray();
  const allItems = await db.receiptItems.toArray();
  const allReceipts = await db.receipts.toArray();

  const now = new Date();
  const cadenceDays = getCadenceDays(activeHousehold.cadence);
  const { nextShopAfter } = getNextShoppingDates(
    now,
    activeHousehold.day,
    cadenceDays,
  );

  // Map receipt IDs to YYYY-MM-DD strings for deduplication/date resolution
  const receiptDateMap = new Map<string, string>();
  for (const r of allReceipts) {
    receiptDateMap.set(r.id, r.date.split("T")[0]);
  }

  // Group purchase dates by product normalizedName
  const productDatesMap = new Map<string, Set<string>>();
  for (const item of allItems) {
    const dateStr = receiptDateMap.get(item.receiptId);
    if (dateStr) {
      const key = item.normalizedName.toLowerCase();
      if (!productDatesMap.has(key)) {
        productDatesMap.set(key, new Set());
      }
      productDatesMap.get(key)!.add(dateStr);
    }
  }

  const predictions: Prediction[] = [];

  for (const product of products) {
    const dateSet = productDatesMap.get(product.normalizedName.toLowerCase());
    const uniqueDates = dateSet
      ? Array.from(dateSet)
          .map((d) => new Date(d))
          .sort((a, b) => a.getTime() - b.getTime())
      : [];

    // Avoid making predictions from insufficient data (we need at least 2 distinct purchase dates)
    // However, we still want to display them in the pantry! So we add them as "learning" status.
    if (uniqueDates.length < 2) {
      if (product.averageConsumptionDays !== null) {
        await db.products.update(product.id, { averageConsumptionDays: null });
      }
      predictions.push({
        productId: product.id,
        normalizedName: product.normalizedName,
        category: product.category,
        averageConsumptionDays: 0,
        lastPurchase: product.lastPurchase,
        predictedRunOutDate: "", // empty means learning phase
        confidence: 30, // low default
        selected: false,
      });
      continue;
    }

    // Calculate historical purchase intervals
    const intervals: number[] = [];
    for (let i = 0; i < uniqueDates.length - 1; i++) {
      const diffTime = uniqueDates[i + 1].getTime() - uniqueDates[i].getTime();
      const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
      if (diffDays > 0) {
        intervals.push(diffDays);
      }
    }

    if (intervals.length === 0) {
      continue;
    }

    // 1. Observed historical average
    const avgObserved =
      intervals.reduce((sum, val) => sum + val, 0) / intervals.length;

    // 2. Household-aware prior
    const priorInterval = getPriorInterval(product.category, activeHousehold);

    // 3. Credibility weight based on data volume (number of intervals)
    const w = Math.min(0.9, intervals.length / 5);

    // 4. Combined average consumption days
    const avgConsumptionDays = w * avgObserved + (1 - w) * priorInterval;

    // Write back to database to keep in sync
    const roundedAvg = Math.round(avgConsumptionDays);
    if (product.averageConsumptionDays !== roundedAvg) {
      await db.products.update(product.id, {
        averageConsumptionDays: roundedAvg,
      });
    }

    // 5. Predict run out date based on last purchase
    const lastPurchaseDate = new Date(product.lastPurchase);
    const runOutDate = new Date(
      lastPurchaseDate.getTime() + roundedAvg * 24 * 60 * 60 * 1000,
    );

    // 6. Confidence score: based on purchase count and interval consistency (CV)
    const m = intervals.length;
    let confidence = 40;
    if (m === 2) confidence = 55;
    else if (m === 3) confidence = 70;
    else if (m === 4) confidence = 80;
    else if (m >= 5) confidence = 90;

    if (m >= 2) {
      const variance =
        intervals.reduce((sum, val) => sum + (val - avgObserved) ** 2, 0) / m;
      const stdDev = Math.sqrt(variance);
      const cv = stdDev / avgObserved;

      if (cv <= 0.15) {
        confidence = Math.min(98, confidence + 8);
      } else if (cv > 0.4) {
        const penalty = Math.min(25, Math.round((cv - 0.4) * 50));
        confidence = Math.max(10, confidence - penalty);
      }
    }

    // 7. Auto-selection for shopping list: runs out before or on the next shop after next
    // i.e., runOutDate <= nextShopAfter
    const selected = runOutDate.getTime() <= nextShopAfter.getTime();

    predictions.push({
      productId: product.id,
      normalizedName: product.normalizedName,
      category: product.category,
      averageConsumptionDays: roundedAvg,
      lastPurchase: product.lastPurchase,
      predictedRunOutDate: runOutDate.toISOString(),
      confidence,
      selected,
    });
  }

  // Sort by predicted run out date ascending
  predictions.sort(
    (a, b) =>
      new Date(a.predictedRunOutDate).getTime() -
      new Date(b.predictedRunOutDate).getTime(),
  );

  cachedPredictions = predictions;
  return cachedPredictions;
}

export async function getPredictions(): Promise<Prediction[]> {
  if (cachedPredictions.length === 0) {
    return recalculatePredictions();
  }
  return cachedPredictions;
}

export function predictionToDisplayItem(prediction: Prediction) {
  const runOut = new Date(prediction.predictedRunOutDate);
  const now = new Date();
  const daysUntil = Math.ceil(
    (runOut.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
  );

  let status: "Soon" | "This week" | "Later" = "Later";
  if (daysUntil <= 2) status = "Soon";
  else if (daysUntil <= 7) status = "This week";

  const dueDay = runOut.toLocaleDateString("en-US", { weekday: "long" });

  // Calculate the percentage of product remaining
  const percentRemaining = Math.max(
    0,
    Math.min(
      100,
      Math.round(
        (Math.max(0, daysUntil) / prediction.averageConsumptionDays) * 100,
      ),
    ),
  );

  // Calculate days since the last purchase
  const lastPurchase = new Date(prediction.lastPurchase);
  const daysSinceLastPurchase = Math.floor(
    (now.getTime() - lastPurchase.getTime()) / (1000 * 60 * 60 * 24),
  );

  return {
    productId: prediction.productId,
    name: prediction.normalizedName,
    emoji: categoryEmoji[prediction.category],
    amount: "1",
    remaining:
      daysUntil <= 0
        ? "Likely empty"
        : `About ${Math.max(1, Math.round((1 - daysUntil / prediction.averageConsumptionDays) * 100))}% used`,
    due: daysUntil <= 0 ? "Now" : dueDay,
    confidence: prediction.confidence,
    cadence: `Usually every ${prediction.averageConsumptionDays} days`,
    status,
    selected: prediction.selected,
    percentRemaining,
    daysSinceLastPurchase,
  };
}

export function getNextShopLikelihood(household?: Household): {
  likely: boolean;
  confidence: number;
  day: string;
} {
  // Load household settings
  let activeHousehold = household;
  if (!activeHousehold && typeof window !== "undefined") {
    const saved = window.localStorage.getItem("milo-household");
    if (saved) {
      try {
        activeHousehold = JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse household settings in predictor", e);
      }
    }
  }

  // Fallback defaults if not found
  if (!activeHousehold) {
    activeHousehold = {
      name: "",
      adults: 2,
      children: 0,
      pets: 1,
      cadence: "Weekly",
      day: "Friday",
      cooking: "Most days",
      preferences: "No preferences",
    };
  }

  const now = new Date();
  const cadenceDays = getCadenceDays(activeHousehold.cadence);
  const { nextShop } = getNextShoppingDates(
    now,
    activeHousehold.day,
    cadenceDays,
  );

  const soonItems = cachedPredictions.filter((p) => {
    const daysUntil = Math.ceil(
      (new Date(p.predictedRunOutDate).getTime() - now.getTime()) /
        (1000 * 60 * 60 * 24),
    );
    // Soon if it runs out on or before the next shopping day, or in <= 3 days
    return (
      daysUntil <= 3 ||
      new Date(p.predictedRunOutDate).getTime() <= nextShop.getTime()
    );
  });

  const confidence =
    soonItems.length > 0 ? Math.min(92, 60 + soonItems.length * 8) : 40;

  // Format the display day to show the next shopping day
  const day = nextShop.toLocaleDateString("en-US", { weekday: "long" });

  return {
    likely:
      soonItems.length >= 2 ||
      (activeHousehold.day !== "No usual day" && soonItems.length >= 1),
    confidence,
    day,
  };
}

export async function recordStillHaveFeedback(
  productId: string,
): Promise<void> {
  const product = await db.products.get(productId);
  if (!product) return;

  // If the user still has some, the average consumption days is too short.
  // Let's adjust it upward by 15% (or at least 1 day).
  const currentAvg = product.averageConsumptionDays || 7;
  const newAvg = Math.max(currentAvg + 1, Math.round(currentAvg * 1.15));

  await db.products.update(productId, {
    averageConsumptionDays: newAvg,
  });

  await recalculatePredictions();
}

export async function recordRanOutFeedback(productId: string): Promise<void> {
  const product = await db.products.get(productId);
  if (!product) return;

  // Calculate actual interval since last purchase
  const lastPurchase = new Date(product.lastPurchase);
  const now = new Date();
  const diffTime = now.getTime() - lastPurchase.getTime();
  const daysSince = Math.max(1, Math.round(diffTime / (1000 * 60 * 60 * 24)));

  // Update average consumption days with this completed interval
  const currentAvg = product.averageConsumptionDays || daysSince;
  // Weight the new completed interval as a new observation
  const newAvg = Math.round(
    (currentAvg * product.purchaseCount + daysSince) /
      (product.purchaseCount + 1),
  );

  await db.products.update(productId, {
    averageConsumptionDays: newAvg,
    purchaseCount: product.purchaseCount + 1,
  });

  await recalculatePredictions();
}

export async function ignoreProductPrediction(
  productId: string,
): Promise<void> {
  await db.products.update(productId, {
    averageConsumptionDays: null,
    purchaseCount: 0,
  });
  await recalculatePredictions();
}
