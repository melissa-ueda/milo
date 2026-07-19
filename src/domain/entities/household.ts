import type {
  Cadence,
  CookingTime,
  FoodPreference,
  ShoppingDay,
} from "../taxonomy/cadence";

/** The people Milo shops for, and the rhythm/habits used as prediction priors. */
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

export const defaultHousehold: Household = {
  name: "",
  adults: 2,
  children: 0,
  pets: 1,
  cadence: "seven_days",
  day: "friday",
  cooking: "most_days",
  preferences: "vegetarian",
};
