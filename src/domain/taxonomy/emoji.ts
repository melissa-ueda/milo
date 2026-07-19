import type { ProductType } from "./product-type";

/** Code → emoji. Pure data (an emoji is an identifier, not localized copy). */
export const PRODUCT_TYPE_EMOJI: Record<ProductType, string> = {
  milk: "🥛",
  oat_milk: "🥛",
  yogurt: "🥛",
  egg: "🥚",
  bread: "🍞",
  sourdough: "🍞",
  toast: "🍞",
  coffee: "☕",
  olive_oil: "🫒",
  oil: "🫗",
  banana: "🍌",
  apple: "🍎",
  salad: "🥗",
  avocado: "🥑",
  cheese: "🧀",
  chicken: "🍗",
  broccoli: "🥦",
  tomato: "🍅",
  spinach: "🥬",
  water: "💧",
  pasta: "🍝",
  spaghetti: "🍝",
  lemon: "🍋",
  orange: "🍊",
  other: "🛒",
};

export function emojiForType(type: ProductType): string {
  return PRODUCT_TYPE_EMOJI[type] ?? "🛒";
}
