import type { Category } from './categories';

export type ParsedItem = {
  name: string;
  normalizedName: string;
  category: Category;
  quantity: number;
  unit: string;
  price: number;
  confidence: number;
};

export type ParsedReceipt = {
  store: string;
  purchaseDate: string;
  items: ParsedItem[];
};

export type ReviewItem = ParsedItem & {
  id: string;
};

export type ReceiptRecord = {
  id: string;
  date: string;
  store: string;
  image: Blob;
};

export type ReceiptItemRecord = {
  id: string;
  receiptId: string;
  normalizedName: string;
  category: Category;
  quantity: number;
  unit: string;
  price: number;
};

export type ProductRecord = {
  id: string;
  normalizedName: string;
  category: Category;
  averageConsumptionDays: number | null;
  lastPurchase: string;
  purchaseCount: number;
};

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
