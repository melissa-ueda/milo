import { describe, expect, it } from "vitest";
import { asProductType, productTypeForName } from "./product-type";

describe("productTypeForName", () => {
  it("matches specific keywords before general ones", () => {
    expect(productTypeForName("Organic Oat Milk 1L")).toBe("oat_milk");
    expect(productTypeForName("Whole Milk")).toBe("milk");
    expect(productTypeForName("Extra virgin olive oil")).toBe("olive_oil");
    expect(productTypeForName("Sourdough loaf")).toBe("sourdough");
  });

  it("falls back to other for unknown names", () => {
    expect(productTypeForName("Mystery snack")).toBe("other");
  });
});

describe("asProductType", () => {
  it("passes through valid codes and coerces invalid to other", () => {
    expect(asProductType("cheese")).toBe("cheese");
    expect(asProductType("not-a-code")).toBe("other");
  });
});
