/**
 * Fine-grained product identity (the "kind" of grocery). Values are stable
 * machine CODES. A `ProductType` carries an emoji (see `emoji.ts`) and can be
 * guessed from a free-text product name via `productTypeForName`.
 */
export const PRODUCT_TYPE_CODES = [
  // Dairy
  "milk",
  "oat_milk",
  "almond_milk",
  "yogurt",
  "cheese",
  "butter",
  "cream",

  // Eggs
  "egg",

  // Bakery
  "bread",
  "sourdough",
  "toast",
  "bagel",
  "croissant",
  "tortilla",

  // Drinks
  "coffee",
  "tea",
  "water",
  "juice",
  "soda",
  "beer",
  "wine",

  // Oils & Condiments
  "olive_oil",
  "oil",
  "vinegar",
  "ketchup",
  "mustard",
  "mayonnaise",
  "soy_sauce",
  "salt",
  "pepper",
  "spice",

  // Fruits
  "banana",
  "apple",
  "orange",
  "lemon",
  "lime",
  "grape",
  "strawberry",
  "blueberry",
  "watermelon",
  "peach",
  "pear",
  "pineapple",
  "kiwi",
  "mango",
  "coconut",
  "avocado",

  // Vegetables
  "salad",
  "lettuce",
  "spinach",
  "kale",
  "broccoli",
  "cucumber",
  "tomato",
  "potato",
  "sweet_potato",
  "carrot",
  "onion",
  "garlic",
  "mushroom",
  "corn",
  "pepper_vegetable",
  "eggplant",
  "cabbage",

  // Meat & Fish
  "chicken",
  "beef",
  "pork",
  "bacon",
  "sausage",
  "fish",
  "salmon",
  "shrimp",
  "tuna",

  // Pasta & Grains
  "pasta",
  "spaghetti",
  "rice",
  "oats",
  "cereal",
  "flour",

  // Legumes
  "beans",
  "lentils",
  "chickpeas",

  // Frozen
  "frozen",

  // Snacks & Sweets
  "chocolate",
  "cookie",
  "chips",
  "popcorn",
  "candy",
  "ice_cream",
  "cake",
  "honey",
  "jam",

  // Cleaning
  "detergent",
  "soap",
  "sponge",
  "bleach",
  "paper_towel",
  "toilet_paper",
  "trash_bag",

  // Personal Care
  "shampoo",
  "conditioner",
  "toothpaste",
  "toothbrush",
  "deodorant",
  "razor",

  // Baby
  "diaper",
  "baby_food",

  // Pets
  "pet_food",
  "cat_food",

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
  // Dairy
  ["oat milk", "oat_milk"],
  ["almond milk", "almond_milk"],
  ["milk", "milk"],
  ["yogurt", "yogurt"],
  ["cheese", "cheese"],
  ["butter", "butter"],
  ["cream", "cream"],

  // Eggs
  ["egg", "egg"],

  // Bakery
  ["sourdough", "sourdough"],
  ["bread", "bread"],
  ["toast", "toast"],
  ["bagel", "bagel"],
  ["croissant", "croissant"],
  ["tortilla", "tortilla"],

  // Drinks
  ["coffee", "coffee"],
  ["tea", "tea"],
  ["water", "water"],
  ["juice", "juice"],
  ["soda", "soda"],
  ["beer", "beer"],
  ["wine", "wine"],

  // Oils & Condiments
  ["olive oil", "olive_oil"],
  ["soy sauce", "soy_sauce"],
  ["vinegar", "vinegar"],
  ["ketchup", "ketchup"],
  ["mustard", "mustard"],
  ["mayonnaise", "mayonnaise"],
  ["salt", "salt"],
  ["pepper", "pepper"],
  ["spice", "spice"],
  ["oil", "oil"],

  // Fruits
  ["banana", "banana"],
  ["apple", "apple"],
  ["orange", "orange"],
  ["lemon", "lemon"],
  ["lime", "lime"],
  ["grape", "grape"],
  ["strawberry", "strawberry"],
  ["blueberry", "blueberry"],
  ["watermelon", "watermelon"],
  ["peach", "peach"],
  ["pear", "pear"],
  ["pineapple", "pineapple"],
  ["kiwi", "kiwi"],
  ["mango", "mango"],
  ["coconut", "coconut"],
  ["avocado", "avocado"],

  // Vegetables
  ["salad", "salad"],
  ["lettuce", "lettuce"],
  ["spinach", "spinach"],
  ["kale", "kale"],
  ["broccoli", "broccoli"],
  ["cucumber", "cucumber"],
  ["tomato", "tomato"],
  ["sweet potato", "sweet_potato"],
  ["potato", "potato"],
  ["carrot", "carrot"],
  ["onion", "onion"],
  ["garlic", "garlic"],
  ["mushroom", "mushroom"],
  ["corn", "corn"],
  ["bell pepper", "pepper_vegetable"],
  ["pepper vegetable", "pepper_vegetable"],
  ["eggplant", "eggplant"],
  ["cabbage", "cabbage"],

  // Meat & Fish
  ["chicken", "chicken"],
  ["beef", "beef"],
  ["pork", "pork"],
  ["bacon", "bacon"],
  ["sausage", "sausage"],
  ["salmon", "salmon"],
  ["shrimp", "shrimp"],
  ["tuna", "tuna"],
  ["fish", "fish"],

  // Pasta & Grains
  ["spaghetti", "spaghetti"],
  ["pasta", "pasta"],
  ["rice", "rice"],
  ["oats", "oats"],
  ["cereal", "cereal"],
  ["flour", "flour"],

  // Legumes
  ["beans", "beans"],
  ["lentils", "lentils"],
  ["chickpeas", "chickpeas"],

  // Snacks & Sweets
  ["chocolate", "chocolate"],
  ["cookie", "cookie"],
  ["cookies", "cookie"],
  ["chips", "chips"],
  ["popcorn", "popcorn"],
  ["candy", "candy"],
  ["ice cream", "ice_cream"],
  ["cake", "cake"],
  ["honey", "honey"],
  ["jam", "jam"],

  // Cleaning
  ["detergent", "detergent"],
  ["soap", "soap"],
  ["sponge", "sponge"],
  ["bleach", "bleach"],
  ["paper towel", "paper_towel"],
  ["toilet paper", "toilet_paper"],
  ["trash bag", "trash_bag"],

  // Personal Care
  ["shampoo", "shampoo"],
  ["conditioner", "conditioner"],
  ["toothpaste", "toothpaste"],
  ["toothbrush", "toothbrush"],
  ["deodorant", "deodorant"],
  ["razor", "razor"],

  // Baby
  ["diaper", "diaper"],
  ["baby food", "baby_food"],

  // Pets
  ["pet food", "pet_food"],
  ["cat food", "cat_food"],

  // Frozen
  ["frozen", "frozen"],
];

export function productTypeForName(name: string): ProductType {
  const normalized = name.toLowerCase();
  return (
    KEYWORDS.find(([keyword]) => normalized.includes(keyword))?.[1] ?? "other"
  );
}
