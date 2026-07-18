import Dexie, { type Table } from "dexie";
import { ReceiptRecord } from "../types/receipt-record";
import { ReceiptItemRecord } from "../types/receipt-item-record";
import { ProductRecord } from "../types/product-record";

class MiloDatabase extends Dexie {
  receipts!: Table<ReceiptRecord>;
  receiptItems!: Table<ReceiptItemRecord>;
  products!: Table<ProductRecord>;

  constructor() {
    super("milo");
    this.version(1).stores({
      receipts: "id, date, store",
      receiptItems: "id, receiptId, normalizedName",
      products: "id, normalizedName, category, lastPurchase",
    });
  }
}

export const db = new MiloDatabase();
