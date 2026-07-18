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
} as const;

export const TYPE_LIST = Object.values(Types);

export type Type = (typeof Types)[keyof typeof Types];
