import type { TokenConfig } from "@/lib/tokens/config";

export type QuoteRequest = {
  inputToken: TokenConfig;
  outputToken: TokenConfig;
  inputAmount: bigint;
  slippageBps: number;
  owner: string;
};

export type SwapQuote = {
  inputAmount: bigint;
  outputAmount: bigint;
  minimumOutputAmount: bigint;
  priceImpactPercent: number;
  networkFeeLamports: bigint;
  expiresAt: number;
  provider: string;
};

export interface SwapProvider {
  getQuote(request: QuoteRequest): Promise<SwapQuote>;
  buildTransaction(request: QuoteRequest, quote: SwapQuote): Promise<unknown>;
}

export function calculateMinimumOutput(outputAmount: bigint, slippageBps: number): bigint {
  if (outputAmount < 0n) throw new Error("Output amount cannot be negative.");
  if (!Number.isInteger(slippageBps) || slippageBps < 0 || slippageBps > 10_000) {
    throw new Error("Slippage must be an integer from 0 to 10,000 basis points.");
  }
  return (outputAmount * BigInt(10_000 - slippageBps)) / 10_000n;
}

export function isSufficientBalance(amount: bigint, balance: bigint): boolean {
  return amount >= 0n && balance >= 0n && amount <= balance;
}

export function getSwapProvider(): SwapProvider | null {
  return null;
}

export function getSwapReadiness() {
  const provider = getSwapProvider();
  return {
    available: provider !== null,
    reason: provider ? null : "The repository does not include a deployed cNGN swap adapter, IDL, or quote/liquidity service.",
  };
}
