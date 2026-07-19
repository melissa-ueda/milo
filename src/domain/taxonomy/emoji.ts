import type { ProductType } from "./product-type";

/** Code → emoji. Pure data (an emoji is an identifier, not localized copy). */
export const PRODUCT_TYPE_EMOJI: Record<ProductType, string> = {
  // Dairy
  milk: "🥛",
  oat_milk: "🥛",
  almond_milk: "🥛",
  yogurt: "🥛",
  cheese: "🧀",
  butter: "🧈",
  cream: "🥛",

  // Eggs
  egg: "🥚",

  // Bakery
  bread: "🍞",
  sourdough: "🍞",
  toast: "🍞",
  bagel: "🥯",
  croissant: "🥐",
  tortilla: "🌮",

  // Drinks
  coffee: "☕",
  tea: "🫖",
  water: "💧",
  juice: "🧃",
  soda: "🥤",
  beer: "🍺",
  wine: "🍷",

  // Oils & Condiments
  olive_oil: "🫒",
  oil: "🫗",
  vinegar: "🍶",
  ketchup: "🍅",
  mustard: "🌭",
  mayonnaise: "🥫",
  soy_sauce: "🍶",
  salt: "🧂",
  pepper: "🧂",
  spice: "🧂",

  // Fruits
  banana: "🍌",
  apple: "🍎",
  orange: "🍊",
  lemon: "🍋",
  lime: "🍋",
  grape: "🍇",
  strawberry: "🍓",
  blueberry: "🫐",
  watermelon: "🍉",
  peach: "🍑",
  pear: "🍐",
  pineapple: "🍍",
  kiwi: "🥝",
  mango: "🥭",
  coconut: "🥥",
  avocado: "🥑",

  // Vegetables
  salad: "🥗",
  lettuce: "🥬",
  spinach: "🥬",
  kale: "🥬",
  broccoli: "🥦",
  cucumber: "🥒",
  tomato: "🍅",
  potato: "🥔",
  sweet_potato: "🍠",
  carrot: "🥕",
  onion: "🧅",
  garlic: "🧄",
  mushroom: "🍄",
  corn: "🌽",
  pepper_vegetable: "🫑",
  eggplant: "🍆",
  cabbage: "🥬",

  // Meat & Fish
  chicken: "🍗",
  beef: "🥩",
  pork: "🥩",
  bacon: "🥓",
  sausage: "🌭",
  fish: "🐟",
  salmon: "🍣",
  shrimp: "🦐",
  tuna: "🐟",

  // Pasta & Grains
  pasta: "🍝",
  spaghetti: "🍝",
  rice: "🍚",
  oats: "🌾",
  cereal: "🥣",
  flour: "🌾",

  // Legumes
  beans: "🫘",
  lentils: "🫘",
  chickpeas: "🫘",

  // Frozen
  frozen: "🧊",

  // Snacks & Sweets
  chocolate: "🍫",
  cookie: "🍪",
  chips: "🥔",
  popcorn: "🍿",
  candy: "🍬",
  ice_cream: "🍨",
  cake: "🍰",
  honey: "🍯",
  jam: "🍓",

  // Cleaning
  detergent: "🧴",
  soap: "🧼",
  sponge: "🧽",
  bleach: "🧪",
  paper_towel: "🧻",
  toilet_paper: "🧻",
  trash_bag: "🗑️",

  // Personal Care
  shampoo: "🧴",
  conditioner: "🧴",
  toothpaste: "🪥",
  toothbrush: "🪥",
  deodorant: "🧴",
  razor: "🪒",

  // Baby
  diaper: "👶",
  baby_food: "🍼",

  // Pets
  pet_food: "🐶",
  cat_food: "🐱",

  other: "🛒",
};

export function emojiForType(type: ProductType): string {
  return PRODUCT_TYPE_EMOJI[type] ?? "🛒";
}
