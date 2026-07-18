import Dexie, { type Table } from 'dexie';
import type { ProductRecord, ReceiptItemRecord, ReceiptRecord } from '../types';

class MiloDatabase extends Dexie {
  receipts!: Table<ReceiptRecord>;
  receiptItems!: Table<ReceiptItemRecord>;
  products!: Table<ProductRecord>;

  constructor() {
    super('milo');
    this.version(1).stores({
      receipts: 'id, date, store',
      receiptItems: 'id, receiptId, normalizedName',
      products: 'id, normalizedName, category, lastPurchase',
    });
  }
}

export const db = new MiloDatabase();
