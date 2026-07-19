/** Mints opaque unique identifiers (staples, receipts, receipt lines). */
export type IdGenerator = {
  newId(): string;
};
