import Dexie, { type Table } from "dexie";
import type {
  ReceiptLineRow,
  ReceiptRow,
  SettingsRow,
  StapleRow,
} from "./records";

/**
 * IndexedDB schema. A NEW database name (`milo-app`) — a deliberate fresh start
 * so the old English-enum data from the previous architecture is simply ignored
 * (no migration by product decision). All rows store machine codes only.
 */
class MiloDatabase extends Dexie {
  staples!: Table<StapleRow, string>;
  receipts!: Table<ReceiptRow, string>;
  receiptLines!: Table<ReceiptLineRow, string>;
  settings!: Table<SettingsRow, string>;

  constructor() {
    super("milo-app");
    this.version(1).stores({
      staples: "id, matchKey, type, category, lastPurchase",
      receipts: "id, date, store",
      receiptLines: "id, receiptId",
      settings: "id",
    });
  }
}

let instance: MiloDatabase | null = null;

/** Lazily create the DB so it's only opened in the browser, after mount. */
export function getDb(): MiloDatabase {
  if (!instance) instance = new MiloDatabase();
  return instance;
}

export type { MiloDatabase };
