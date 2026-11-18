import { cacheLife } from "next/cache";
import { NextResponse } from "next/server";
import { z } from "zod";

const COINGECKO_BASE_URL = "https://api.coingecko.com/api/v3";
const ASSET_IDS = ["solana", "compliant-naira"] as const;

const marketCoinSchema = z.object({
  id: z.enum(ASSET_IDS),
  name: z.string(),
  symbol: z.string(),
  image: z.string().url(),
  current_price: z.number(),
  price_change_percentage_24h: z.number().nullable().optional(),
  market_cap: z.number().nullable().optional(),
  last_updated: z.string(),
});

function unavailable(status: number) {
  return NextResponse.json(
    { error: "Live market data is temporarily unavailable." },
    { status, headers: { "Cache-Control": "no-store" } },
  );
}

async function getMarketAssets() {
  "use cache";
  cacheLife("minutes");

  const apiKey = process.env.key;

  if (!apiKey) {
    throw new Error("CoinGecko demo key is not configured.");
  }

  const url = new URL(`${COINGECKO_BASE_URL}/coins/markets`);
  url.searchParams.set("vs_currency", "usd");
  url.searchParams.set("ids", ASSET_IDS.join(","));
  url.searchParams.set("price_change_percentage", "24h");

  const response = await fetch(url, {
    headers: {
      Accept: "application/json",
      "x-cg-demo-api-key": apiKey,
    },
    signal: AbortSignal.timeout(10_000),
  });

  if (!response.ok) {
    throw new Error("CoinGecko market request failed.");
  }

  const parsed = z.array(marketCoinSchema).safeParse(await response.json());

  if (!parsed.success) {
    throw new Error("CoinGecko returned unexpected market data.");
  }

  const assets = parsed.data.map((coin) => ({
    id: coin.id,
    name: coin.name,
    symbol: coin.symbol.toUpperCase(),
    image: coin.image,
    currentPriceUsd: coin.current_price,
    change24h: coin.price_change_percentage_24h ?? null,
    marketCapUsd: coin.market_cap ?? null,
    lastUpdatedAt: coin.last_updated,
  }));

  if (assets.length === 0) {
    throw new Error("CoinGecko returned no market data.");
  }

  return assets;
}

export async function GET() {
  try {
    const assets = await getMarketAssets();

    return NextResponse.json(
      { assets },
      {
        headers: {
          "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120",
        },
      },
    );
  } catch {
    return unavailable(503);
  }
}
