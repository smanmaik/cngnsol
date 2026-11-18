"use client";

import useSWR from "swr";
import type { MarketResponse } from "@/lib/market/types";

async function fetchMarketData(url: string): Promise<MarketResponse> {
  const response = await fetch(url, {
    headers: { Accept: "application/json" },
  });
  const body: unknown = await response.json().catch(() => null);

  if (!response.ok) {
    const message =
      typeof body === "object" &&
      body !== null &&
      "error" in body &&
      typeof body.error === "string"
        ? body.error
        : "Market data is temporarily unavailable.";
    throw new Error(message);
  }

  return body as MarketResponse;
}

export function useMarketData() {
  const { data, error, isLoading, isValidating } = useSWR<MarketResponse>(
    "/api/market",
    fetchMarketData,
    {
      dedupingInterval: 60_000,
      keepPreviousData: true,
      refreshInterval: 60_000,
      revalidateOnFocus: true,
    },
  );

  return { data, error, isLoading, isValidating };
}
