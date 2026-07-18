export const Categories = {
  bread: 'bread',
  dairy: 'dairy',
  fruit: 'fruit',
  vegetable: 'vegetable',
  meat: 'meat',
  fish: 'fish',
  beverage: 'beverage',
  snack: 'snack',
  pantry: 'pantry',
  cleaning: 'cleaning',
  personalCare: 'personalCare',
  household: 'household',
  baby: 'baby',
  pet: 'pet',
  other: 'other',
} as const;

export type Category = (typeof Categories)[keyof typeof Categories];

export const CATEGORY_LIST = Object.values(Categories);

export const categoryEmoji: Record<Category, string> = {
  bread: '🍞',
  dairy: '🥛',
  fruit: '🍎',
  vegetable: '🥬',
  meat: '🍗',
  fish: '🐟',
  beverage: '💧',
  snack: '🍿',
  pantry: '🫙',
  cleaning: '🧹',
  personalCare: '🧴',
  household: '🏠',
  baby: '🍼',
  pet: '🐾',
  other: '🛒',
};

export const categoryLabels: Record<Category, string> = {
  bread: 'Bread',
  dairy: 'Dairy',
  fruit: 'Fruit',
  vegetable: 'Vegetable',
  meat: 'Meat',
  fish: 'Fish',
  beverage: 'Beverage',
  snack: 'Snack',
  pantry: 'Pantry',
  cleaning: 'Cleaning',
  personalCare: 'Personal care',
  household: 'Household',
  baby: 'Baby',
  pet: 'Pet',
  other: 'Other',
};
