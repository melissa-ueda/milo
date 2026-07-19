import { describe, expect, it } from "vitest";
import { addMoney, fromMajor, sumMoney, timesMoney, toMajor } from "./money";

describe("money", () => {
  it("round-trips major units without float drift", () => {
    const m = fromMajor(3.5);
    expect(m.cents).toBe(350);
    expect(toMajor(m)).toBe(3.5);
  });

  it("adds and scales in integer cents", () => {
    expect(addMoney(fromMajor(1.1), fromMajor(2.2)).cents).toBe(330);
    expect(timesMoney(fromMajor(1.99), 3).cents).toBe(597);
  });

  it("sums a list", () => {
    expect(
      sumMoney([fromMajor(1.5), fromMajor(2.5), fromMajor(0.99)]).cents,
    ).toBe(499);
  });
});
