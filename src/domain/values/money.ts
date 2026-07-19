/**
 * A monetary amount. Stored in integer minor units (cents) to avoid float
 * drift, with an ISO currency code. Carries NO formatting — turning a `Money`
 * into "€3.50" is a presentation concern (`src/presentation/labels/format.ts`).
 */
export type Money = {
  readonly cents: number;
  readonly currency: string;
};

const DEFAULT_CURRENCY = "EUR";

export function money(
  cents: number,
  currency: string = DEFAULT_CURRENCY,
): Money {
  return { cents: Math.round(cents), currency };
}

/** Build from a major-unit amount (e.g. euros): `fromMajor(3.5)` → 350 cents. */
export function fromMajor(
  amount: number,
  currency: string = DEFAULT_CURRENCY,
): Money {
  return { cents: Math.round(amount * 100), currency };
}

export function toMajor(value: Money): number {
  return value.cents / 100;
}

export function zeroMoney(currency: string = DEFAULT_CURRENCY): Money {
  return { cents: 0, currency };
}

export function addMoney(a: Money, b: Money): Money {
  return { cents: a.cents + b.cents, currency: a.currency };
}

export function timesMoney(value: Money, factor: number): Money {
  return { cents: Math.round(value.cents * factor), currency: value.currency };
}

export function sumMoney(
  values: Money[],
  currency: string = DEFAULT_CURRENCY,
): Money {
  return values.reduce(addMoney, zeroMoney(currency));
}
