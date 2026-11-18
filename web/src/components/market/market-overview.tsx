"use client";

import Image from "next/image";
import { formatPercentage, formatUsd } from "@/lib/market/format";
import { useMarketData } from "@/hooks/use-market-data";

function formatUpdatedAt(value: string): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "recently";

  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    timeZoneName: "short",
  }).format(date);
}

export function MarketOverview() {
  const { data, error, isLoading, isValidating } = useMarketData();
  const assets = data?.assets ?? [];
  const lastUpdatedAt = assets.reduce<string | null>((latest, asset) => {
    if (!latest || new Date(asset.lastUpdatedAt).getTime() > new Date(latest).getTime()) {
      return asset.lastUpdatedAt;
    }

    return latest;
  }, null);

  return (
    <section className="surface market-overview" aria-labelledby="market-overview-title" aria-busy={isLoading || isValidating}>
      <div className="surface-pad">
        <div className="market-overview-header">
          <div>
            <p className="section-kicker">Market snapshot</p>
            <h2 className="market-overview-title" id="market-overview-title">Live prices</h2>
            <p className="market-overview-caption">Solana and cNGN, priced in USD</p>
          </div>
          <div className="market-source">
            <span className="market-live-dot" aria-hidden="true" />
            <span>{lastUpdatedAt ? `Updated ${formatUpdatedAt(lastUpdatedAt)}` : "Live market"}</span>
            <a href="https://www.coingecko.com/" target="_blank" rel="noreferrer">
              CoinGecko
            </a>
          </div>
        </div>

        {error && !data ? (
          <p className="market-message" role="status">Live prices are temporarily unavailable. Please try again shortly.</p>
        ) : isLoading && !data ? (
          <p className="market-message" role="status">Loading current market prices…</p>
        ) : assets.length === 0 ? (
          <p className="market-message" role="status">No market prices are available right now.</p>
        ) : (
          <>
            {error && (
              <p className="market-message" role="status">Showing the latest cached prices while CoinGecko refreshes.</p>
            )}
            <div className="market-grid">
              {assets.map((asset) => {
                const positive = asset.change24h === null || asset.change24h >= 0;

                return (
                  <article className="market-card" key={asset.id} aria-label={`${asset.name} market price`}>
                    <Image
                      className="market-logo"
                      src={asset.image}
                      alt=""
                      width={40}
                      height={40}
                      unoptimized
                    />
                    <div className="market-identity">
                      <p className="market-symbol">{asset.symbol}</p>
                      <p className="market-name">{asset.name}</p>
                    </div>
                    <div className="market-quote">
                      <strong className="market-price">{formatUsd(asset.currentPriceUsd)}</strong>
                      {asset.change24h === null ? (
                        <span className="market-change market-change-neutral">24h —</span>
                      ) : (
                        <span className={`market-change ${positive ? "positive" : "negative"}`}>
                          <span aria-hidden="true">{positive ? "↑" : "↓"}</span>
                          {formatPercentage(asset.change24h)}
                        </span>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
