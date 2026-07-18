import { ParsedItem } from "./parsed-item";

export type ParsedReceipt = {
  store: string;
  purchaseDate: string;
  items: ParsedItem[];
};
