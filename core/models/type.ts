export const Types = {
  milk: "milk",
  oatMilk: "oat milk",
  yogurt: "yogurt",
  egg: "egg",
  bread: "bread",
  sourdough: "sourdough",
  toast: "toast",
  coffee: "coffee",
  oliveOil: "olive oil",
  oil: "oil",
  banana: "banana",
  apple: "apple",
  salad: "salad",
  avocado: "avocado",
  cheese: "cheese",
  chicken: "chicken",
  broccoli: "broccoli",
  tomato: "tomato",
  spinach: "spinach",
  water: "water",
  pasta: "pasta",
  spaghetti: "spaghetti",
  lemon: "lemon",
  orange: "orange",
  other: "other",
} as const;

export const TYPE_LIST = Object.values(Types);

export type Type = (typeof Types)[keyof typeof Types];

export const typeEmoji: Record<Type, string> = {
  milk: "🥛",
  "oat milk": "🥛",
  yogurt: "🥛",
  egg: "🥚",
  bread: "🍞",
  sourdough: "🍞",
  toast: "🍞",
  coffee: "☕",
  "olive oil": "🫒",
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

const typeKeywords: Array<[string, Type]> = [
  ["oat milk", "oat milk"],
  ["olive oil", "olive oil"],
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

export function typeForProductName(name: string): Type {
  const normalized = name.toLowerCase();
  return (
    typeKeywords.find(([keyword]) => normalized.includes(keyword))?.[1] ??
    "other"
  );
}
