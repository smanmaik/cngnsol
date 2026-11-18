"use client";

import Link from "next/link";
import { ArrowUpRight, ExternalLink } from "lucide-react";
import { useWalletBalance } from "@/hooks/use-wallet-balance";
import { formatUnits } from "@/lib/solana/format";
import { getAddressExplorerUrl } from "@/lib/history/explorer";
import { useConnectedWallet } from "@solana/kit-plugin-wallet/react";
import { client } from "@/lib/solana/client";
import { MarketOverview } from "@/components/market/market-overview";
import { useMarketData } from "@/hooks/use-market-data";
import { formatUsd } from "@/lib/market/format";

export function DashboardContent() {
  const connected = useConnectedWallet(client);
  const { balances, isLoading, error } = useWalletBalance();
  const { data: marketData, error: marketError, isLoading: marketLoading } = useMarketData();
  const solPrice = marketData?.assets.find((asset) => asset.id === "solana")?.currentPriceUsd;
  const cngnPrice = marketData?.assets.find((asset) => asset.id === "compliant-naira")?.currentPriceUsd;
  const solAmount = balances ? Number(balances.solLamports) / 1_000_000_000 : null;
  const cngnAmount =
    balances && balances.cngnRaw !== null && balances.cngnDecimals !== null
      ? Number(balances.cngnRaw) / 10 ** balances.cngnDecimals
      : null;
  const portfolioValueUsd =
    solAmount !== null &&
    cngnAmount !== null &&
    solPrice !== undefined &&
    cngnPrice !== undefined
      ? solAmount * solPrice + cngnAmount * cngnPrice
      : null;

  if (!connected) {
    return (
      <main className="subpage">
        <section className="surface surface-pad">
          <div className="empty-state">
            <span>⌁</span>
            <strong>Wallet not connected</strong>
            <p>Connect a Solana wallet to see your portfolio and balances.</p>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="subpage">
      <div className="subpage-header">
        <div>
          <p className="page-kicker">Account</p>
          <h1>Your portfolio</h1>
          <p>Live balances on {connected.wallet.name}</p>
        </div>
      </div>

      <MarketOverview />

      <div className="content-grid">
        <section className="surface">
          <div className="surface-pad">
            <h2 className="surface-title">Balances</h2>
            <p className="surface-description">Your wallet holdings</p>
            <div className="balance-grid">
              <div className="balance-tile">
                <span className="balance-token">◎ SOL</span>
                <span className="balance-value">{isLoading ? "—" : formatUnits(balances?.solLamports ?? null, 9, 6)}</span>
                <span className="balance-caption">Solana</span>
              </div>
              <div className="balance-tile">
                <span className="balance-token">₦ cNGN</span>
                <span className="balance-value">{isLoading ? "—" : formatUnits(balances?.cngnRaw ?? null, balances?.cngnDecimals ?? null, 2)}</span>
                <span className="balance-caption">Nigerian Naira</span>
              </div>
            </div>
            <div className="portfolio-value" aria-busy={isLoading || marketLoading}>
              <div className="portfolio-value-copy">
                <span>Estimated portfolio value</span>
                <small>Wallet balances × live USD prices</small>
              </div>
              <strong>{isLoading || marketLoading ? "Loading…" : portfolioValueUsd === null ? "—" : formatUsd(portfolioValueUsd)}</strong>
            </div>
            <div className="surface-alert">
              <span>
                {error
                  ? "Unable to load balances from Solana RPC. Check your connection and network configuration."
                  : isLoading
                    ? "Loading wallet balances…"
                    : marketError && !marketData
                      ? "Unable to load live CoinGecko prices right now."
                      : marketLoading
                        ? "Loading live CoinGecko prices…"
                        : portfolioValueUsd === null
                          ? "A verified cNGN mint and live prices for both assets are required for a full portfolio value."
                          : "Portfolio value combines SOL and cNGN balances using CoinGecko USD prices."}
              </span>
            </div>
          </div>
        </section>

        <section className="surface">
          <div className="surface-pad">
            <h2 className="surface-title">Quick actions</h2>
            <p className="surface-description">Common operations</p>
            <div className="action-row">
              <Link href="/" className="button button-primary">
                <ArrowUpRight />
                Swap
              </Link>
              <Link href="/receive" className="button button-secondary">
                Receive
              </Link>
              <a
                href={getAddressExplorerUrl(connected.account.address)}
                target="_blank"
                rel="noreferrer"
                className="button button-secondary"
              >
                Explorer <ExternalLink />
              </a>
            </div>
          </div>
        </section>
      </div>

      <section className="surface" style={{ marginTop: "18px" }}>
        <div className="surface-pad">
          <h2 className="surface-title">Recent swaps</h2>
          <p className="surface-description">Swap activity will appear when the deployed cNGN program decoder is connected.</p>
          <div className="action-row">
            <Link href="/history" className="button button-secondary">View all activity <ArrowUpRight /></Link>
          </div>
        </div>
      </section>
    </main>
  );
}
