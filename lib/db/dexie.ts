import Dexie, { type Table } from "dexie";
import type { Receipt, ReceiptItem } from "@/core/models/receipt";
import type { Product } from "@/core/models/product";
import { AppSettings } from "@/core/models/household";

class MiloDatabase extends Dexie {
  receipts!: Table<Receipt>;
  receiptItems!: Table<ReceiptItem>;
  products!: Table<Product>;
  settings!: Table<AppSettings>;

  constructor() {
    super("milo");
    this.version(1).stores({
      receipts: "id, date, store",
      receiptItems: "id, receiptId, normalizedName",
      products: "id, normalizedName, type, category, lastPurchase",
    });
    this.version(2).stores({
      receipts: "id, date, store",
      receiptItems: "id, receiptId, normalizedName",
      products: "id, normalizedName, type, category, lastPurchase, selected",
      settings: "id",
    });
  }
}

export const db = new MiloDatabase();
