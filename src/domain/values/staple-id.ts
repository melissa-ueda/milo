/**
 * A `PantryStaple`'s stable primary key. Branded so it can't be confused with a
 * receipt id or a raw string. IDs are opaque and minted by the `IdGenerator`
 * port — identity is NEVER derived from the product name (that caused silent
 * merges in the old codebase). Names are matched via a separate `matchKey`.
 */
export type StapleId = string & { readonly __brand: "StapleId" };

export function asStapleId(raw: string): StapleId {
  return raw as StapleId;
}

/**
 * Normalized dedupe key derived from a product name — used to decide whether an
 * incoming line refers to a staple the household already tracks. Deliberately
 * separate from identity: two names that normalize alike are a *candidate* merge
 * the use-case decides on, not an automatic key collision.
 */
export function matchKeyFor(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/[\s_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}
