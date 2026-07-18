"use client";

import { useCallback, useState } from "react";
import { typeEmoji } from "@/core/models/type";
import {
  formatCurrency,
  formatReceiptDate,
  getAllReceipts,
  getReceiptItems,
} from "@/lib/db/receipts";
import { addManualProduct, setProductSelected } from "@/lib/db/products";
import {
  predictionToDisplayItem,
  recalculatePredictions,
} from "@/lib/inventory/predictor";
import type { Household } from "@/core/models/household";
import type { Prediction } from "@/core/models/prediction";

export type RecommendationItem = {
  productId?: string;
  name: string;
  emoji: string;
  amount: string;
  remaining: string;
  due: string;
  confidence: number;
  cadence: string;
  status: "Soon" | "This week" | "Later";
  selected: boolean;
  percentRemaining?: number;
  daysSinceLastPurchase?: number;
};

export type PurchaseItem = {
  name: string;
  emoji: string;
  qty: number;
  price: string;
};

export type Purchase = {
  id: string;
  date: string;
  store: string;
  itemCount: string;
  total: string;
  items: PurchaseItem[];
};

export function useMiloData(household: Household, apiKey: string) {
  const [items, setItems] = useState<RecommendationItem[]>([]);
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [dataLoaded, setDataLoaded] = useState(false);

  const refresh = useCallback(async () => {
    const nextPredictions = await recalculatePredictions(household, apiKey);
    setPredictions(nextPredictions);
    setItems(nextPredictions.map(predictionToDisplayItem));

    const receipts = await getAllReceipts();
    const nextPurchases = await Promise.all(
      receipts.map(async (receipt) => {
        const receiptItems = await getReceiptItems(receipt.id);
        return {
          id: receipt.id,
          date: formatReceiptDate(receipt.date),
          store: receipt.store,
          itemCount: `${receiptItems.length} items`,
          total: formatCurrency(
            receiptItems.reduce((sum, item) => sum + item.price, 0),
          ),
          items: receiptItems.map((item) => ({
            name: item.normalizedName,
            emoji: typeEmoji[item.type],
            qty: item.quantity,
            price: formatCurrency(item.price),
          })),
        };
      }),
    );
    setPurchases(nextPurchases);
    setDataLoaded(true);
  }, [apiKey, household]);

  const toggle = useCallback(
    async (name: string) => {
      const item = items.find((candidate) => candidate.name === name);
      if (!item?.productId) return;
      const selected = !item.selected;
      await setProductSelected(item.productId, selected);
      setItems((current) =>
        current.map((candidate) =>
          candidate.name === name ? { ...candidate, selected } : candidate,
        ),
      );
      setPredictions((current) =>
        current.map((prediction) =>
          prediction.productId === item.productId
            ? { ...prediction, selected }
            : prediction,
        ),
      );
    },
    [items],
  );

  const addManualItem = useCallback(
    async (name: string) => {
      await addManualProduct({ name });
      await refresh();
    },
    [refresh],
  );

  return {
    items,
    predictions,
    purchases,
    dataLoaded,
    refresh,
    toggle,
    addManualItem,
    setItems,
  };
}
