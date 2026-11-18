import { isAddress } from "@solana/kit";
import { z } from "zod";
import { getNetworkConfig } from "@/lib/solana/networks";
import { tokens } from "@/lib/tokens/config";

const balanceResponse = z.object({ result: z.object({ value: z.number().int().nonnegative().refine(Number.isSafeInteger) }) });
const tokenSupplyResponse = z.object({ result: z.object({ value: z.object({ amount: z.string(), decimals: z.number() }) }) });
const tokenAccountsResponse = z.object({
  result: z.object({ value: z.array(z.object({
    account: z.object({
      data: z.object({
        parsed: z.object({ info: z.object({ tokenAmount: z.object({ amount: z.string(), decimals: z.number() }) }) }),
      }),
    }),
  })) }),
});
const signaturesResponse = z.object({
  result: z.array(z.object({
    signature: z.string(),
    blockTime: z.number().nullable(),
    err: z.unknown().nullable(),
    confirmationStatus: z.enum(["processed", "confirmed", "finalized"]).nullable().optional(),
  })),
});
const slotResponse = z.object({ result: z.number() });

let requestId = 0;
export async function rpcRequest<T>(method: string, params: unknown[], schema: z.ZodType<T>): Promise<T> {
  const response = await fetch(getNetworkConfig().rpcUrl, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ jsonrpc: "2.0", id: ++requestId, method, params }),
  });
  if (!response.ok) throw new Error(`Solana RPC returned HTTP ${response.status}.`);
  const payload: unknown = await response.json();
  const parsed = schema.safeParse(payload);
  if (!parsed.success) throw new Error("Solana RPC returned an unexpected response.");
  return parsed.data;
}

export type WalletBalances = { solLamports: bigint; cngnRaw: bigint | null; cngnDecimals: number | null };

export async function fetchWalletBalances(owner: string): Promise<WalletBalances> {
  if (!isAddress(owner)) throw new Error("The connected wallet address is invalid.");
  const solResponse = await rpcRequest("getBalance", [owner, { commitment: "confirmed" }], balanceResponse);
  const mint = tokens.cngn.mint;
  if (!mint || !isAddress(mint)) return { solLamports: BigInt(solResponse.result.value), cngnRaw: null, cngnDecimals: null };
  const [tokenResponse, supplyResponse] = await Promise.all([
    rpcRequest("getTokenAccountsByOwner", [owner, { mint }, { commitment: "confirmed", encoding: "jsonParsed" }], tokenAccountsResponse),
    rpcRequest("getTokenSupply", [mint, { commitment: "confirmed" }], tokenSupplyResponse),
  ]);
  const accounts = tokenResponse.result.value;
  const raw = accounts.reduce((sum, account) => sum + BigInt(account.account.data.parsed.info.tokenAmount.amount), 0n);
  const decimals = accounts[0]?.account.data.parsed.info.tokenAmount.decimals ?? supplyResponse.result.value.decimals;
  return { solLamports: BigInt(solResponse.result.value), cngnRaw: raw, cngnDecimals: decimals };
}

export async function fetchWalletActivity(owner: string) {
  if (!isAddress(owner)) throw new Error("The connected wallet address is invalid.");
  const response = await rpcRequest("getSignaturesForAddress", [owner, { limit: 12, commitment: "confirmed" }], signaturesResponse);
  return response.result;
}

export async function fetchLatestSlot() {
  const response = await rpcRequest("getSlot", [{ commitment: "confirmed" }], slotResponse);
  return response.result;
}
