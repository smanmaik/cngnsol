import { describe, expect, it } from "vitest";
import { formatUnits, parseUnits, shortenAddress } from "./format";
import { calculateMinimumOutput, isSufficientBalance } from "../swap/provider";

describe("token amount conversion", () => {
  it("parses decimal amounts to base units without floating point", () => {
    expect(parseUnits("100000.25", 2)).toBe(10000025n);
    expect(parseUnits("0.000000001", 9)).toBe(1n);
  });

  it("rejects malformed, negative, blank, and over-precision amounts", () => {
    expect(parseUnits("", 9)).toBeNull();
    expect(parseUnits("-1", 9)).toBeNull();
    expect(parseUnits("1.0000000001", 9)).toBeNull();
    expect(parseUnits("1..2", 9)).toBeNull();
  });

  it("formats whole token amounts and preserves zero-decimal tokens", () => {
    expect(formatUnits(10000025n, 2)).toBe("100,000.25");
    expect(formatUnits(42n, 0)).toBe("42");
    expect(formatUnits(null, null)).toBe("—");
  });

  it("shortens addresses without altering short values", () => {
    expect(shortenAddress("1234567890", 3)).toBe("123…890");
    expect(shortenAddress("12345", 3)).toBe("12345");
  });
});

describe("swap safety calculations", () => {
  it("applies slippage in integer basis points", () => {
    expect(calculateMinimumOutput(10000n, 50)).toBe(9950n);
    expect(calculateMinimumOutput(3n, 50)).toBe(2n);
  });

  it("rejects invalid slippage values", () => {
    expect(() => calculateMinimumOutput(100n, -1)).toThrow();
    expect(() => calculateMinimumOutput(100n, 10001)).toThrow();
  });

  it("checks sufficient balances without number coercion", () => {
    expect(isSufficientBalance(100n, 100n)).toBe(true);
    expect(isSufficientBalance(101n, 100n)).toBe(false);
  });
});
