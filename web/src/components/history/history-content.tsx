"use client";

import useSWR from "swr";
import { ExternalLink } from "lucide-react";
import { useConnectedWallet } from "@solana/kit-plugin-wallet/react";
import { client } from "@/lib/solana/client";
import { fetchWalletActivity } from "@/lib/solana/rpc";
import { getTransactionExplorerUrl } from "@/lib/history/explorer";
import { shortenAddress } from "@/lib/solana/format";

export function HistoryContent() {
  const connected = useConnectedWallet(client);
  const { data: activity, isLoading, error } = useSWR(
    connected ? ["wallet-activity", connected.account.address] : null,
    ([, address]) => fetchWalletActivity(address)
  );

  if (!connected) {
    return (
      <main className="subpage">
        <section className="surface surface-pad">
          <div className="empty-state">
            <span>◎</span>
            <strong>Wallet not connected</strong>
            <p>Connect a Solana wallet to see your transaction activity.</p>
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
          <h1>Activity</h1>
          <p>Recent transactions on {connected.wallet.name}</p>
        </div>
      </div>

      <section className="surface">
        <div className="surface-pad">
          <h2 className="surface-title">Recent transactions</h2>
          <p className="surface-description">Your 12 latest onchain transactions. Swap amounts remain unavailable until the program decoder is connected.</p>

          {isLoading ? (
            <div className="empty-state" style={{ padding: "30px 0" }}>
              <span>…</span>
              <strong>Loading…</strong>
            </div>
          ) : error ? (
            <div className="empty-state" style={{ padding: "30px 0" }}>
              <span>!</span>
              <strong>Unable to load activity</strong>
              <p>Solana RPC could not return this wallet&apos;s recent transactions. Check the network and try again.</p>
            </div>
          ) : !activity || activity.length === 0 ? (
            <div className="empty-state" style={{ padding: "30px 0" }}>
              <span>↗</span>
              <strong>No activity yet</strong>
              <p>Your transactions will appear here once confirmed on Solana.</p>
            </div>
          ) : (
            <div className="activity-list">
              {activity.map((tx) => (
                <div key={tx.signature} className="activity-row">
                  <div className="activity-main">
                    <div className="activity-mark">↗</div>
                    <div>
                      <strong>Transaction</strong>
                      <span>{shortenAddress(tx.signature, 8)}</span>
                    </div>
                  </div>
                  <span className={`status-badge status-${tx.err ? "failed" : "confirmed"}`}>
                    {tx.err ? "Failed" : "Confirmed"}
                  </span>
                  <span className="activity-time">{tx.blockTime ? new Date(tx.blockTime * 1000).toLocaleString() : "Time unavailable"}</span>
                  <a
                    href={getTransactionExplorerUrl(tx.signature)}
                    target="_blank"
                    rel="noreferrer"
                    className="text-primary hover:text-primary/80"
                    aria-label="View on explorer"
                  >
                    <ExternalLink size={16} />
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
