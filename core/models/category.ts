export const Categories = {
  bread: "bread",
  dairy: "dairy",
  fruit: "fruit",
  vegetable: "vegetable",
  meat: "meat",
  fish: "fish",
  beverage: "beverage",
  snack: "snack",
  pantry: "pantry",
  cleaning: "cleaning",
  personalCare: "personalCare",
  household: "household",
  baby: "baby",
  pet: "pet",
  other: "other",
} as const;

export const CATEGORY_LIST = Object.values(Categories);

export type Category = (typeof Categories)[keyof typeof Categories];
