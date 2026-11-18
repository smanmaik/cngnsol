export type MarketAsset = {
  id: "solana" | "compliant-naira";
  name: string;
  symbol: string;
  image: string;
  currentPriceUsd: number;
  change24h: number | null;
  marketCapUsd: number | null;
  lastUpdatedAt: string;
};

export type MarketResponse = {
  assets: MarketAsset[];
};
