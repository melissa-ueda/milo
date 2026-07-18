export const Cadences = {
  seven_days: "Weekly",
  ten_days: "Every 10 days",
  fourteen_days: "Every two weeks",
  variable: "It varies",
} as const;

export const ShoppingDays = {
  monday: "Monday",
  tuesday: "Tuesday",
  wednesday: "Wednesday",
  thursday: "Thursday",
  friday: "Friday",
  saturday: "Saturday",
  sunday: "Sunday",
  noUsualDay: "No usual day",
} as const;

export const CookingTimes = {
  mostDays: "Most days",
  aFewDays: "A few days a week",
  rarely: "Rarely",
} as const;

export const FoodPreferences = {
  noPreference: "No preferences",
  vegetarian: "Vegetarian-friendly",
  vegan: "Vegan",
  glutenFree: "Gluten-free",
  familyFriendly: "Family-friendly",
} as const;

export const CADENCE_LIST = Object.values(Cadences);
export const SHOPPING_DAY_LIST = Object.values(ShoppingDays);
export const COOKING_TIMES_LIST = Object.values(CookingTimes);
export const FOOD_PREFERENCES_LIST = Object.values(FoodPreferences);

export type Cadence = (typeof Cadences)[keyof typeof Cadences];
export type ShoppingDay = (typeof ShoppingDays)[keyof typeof ShoppingDays];
export type CookingTime = (typeof CookingTimes)[keyof typeof CookingTimes];
export type FoodPreference =
  (typeof FoodPreferences)[keyof typeof FoodPreferences];

export type Household = {
  name: string;
  adults: number;
  children: number;
  pets: number;
  cadence: Cadence;
  day: ShoppingDay;
  cooking: CookingTime;
  preferences: FoodPreference;
};

export type AppSettings = {
  id: "app";
  household: Household;
  geminiApiKey: string;
  onboarded: boolean;
};
