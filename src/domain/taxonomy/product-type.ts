/**
 * Fine-grained product identity (the "kind" of grocery). Values are stable
 * machine CODES. A `ProductType` carries an emoji (see `emoji.ts`) and can be
 * guessed from a free-text product name via `productTypeForName`.
 */
export const PRODUCT_TYPE_CODES = [
  "milk",
  "oat_milk",
  "yogurt",
  "egg",
  "bread",
  "sourdough",
  "toast",
  "coffee",
  "olive_oil",
  "oil",
  "banana",
  "apple",
  "salad",
  "avocado",
  "cheese",
  "chicken",
  "broccoli",
  "tomato",
  "spinach",
  "water",
  "pasta",
  "spaghetti",
  "lemon",
  "orange",
  "other",
] as const;

export type ProductType = (typeof PRODUCT_TYPE_CODES)[number];

export function isProductType(value: string): value is ProductType {
  return (PRODUCT_TYPE_CODES as readonly string[]).includes(value);
}

export function asProductType(value: string): ProductType {
  return isProductType(value) ? value : "other";
}

/**
 * Ordered keyword → code list. Order is load-bearing: more specific keywords
 * must precede the general ones they contain (e.g. `oat milk` before `milk`).
 */
const KEYWORDS: ReadonlyArray<readonly [string, ProductType]> = [
  ["oat milk", "oat_milk"],
  ["olive oil", "olive_oil"],
  ["spaghetti", "spaghetti"],
  ["sourdough", "sourdough"],
  ["yogurt", "yogurt"],
  ["coffee", "coffee"],
  ["banana", "banana"],
  ["apple", "apple"],
  ["avocado", "avocado"],
  ["cheese", "cheese"],
  ["chicken", "chicken"],
  ["broccoli", "broccoli"],
  ["tomato", "tomato"],
  ["spinach", "spinach"],
  ["water", "water"],
  ["pasta", "pasta"],
  ["lemon", "lemon"],
  ["orange", "orange"],
  ["milk", "milk"],
  ["egg", "egg"],
  ["bread", "bread"],
  ["toast", "toast"],
  ["oil", "oil"],
  ["salad", "salad"],
];

export function productTypeForName(name: string): ProductType {
  const normalized = name.toLowerCase();
  return (
    KEYWORDS.find(([keyword]) => normalized.includes(keyword))?.[1] ?? "other"
  );
}
