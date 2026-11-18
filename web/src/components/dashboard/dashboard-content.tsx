"use client";

import Link from "next/link";
import { ArrowUpRight, ExternalLink } from "lucide-react";
import { useWalletBalance } from "@/hooks/use-wallet-balance";
import { formatUnits } from "@/lib/solana/format";
import { getAddressExplorerUrl } from "@/lib/history/explorer";
import { useConnectedWallet } from "@solana/kit-plugin-wallet/react";
import { client } from "@/lib/solana/client";

export function DashboardContent() {
  const connected = useConnectedWallet(client);
  const { balances, isLoading, error } = useWalletBalance();

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
            <div className="surface-alert">
              <span>{error ? "Unable to load balances from Solana RPC. Check your connection and network configuration." : "Portfolio value is unavailable because no live price feed is configured."}</span>
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
