"use client";

import useSWR from "swr";
import { AlertCircle } from "lucide-react";
import { getNetworkConfig } from "@/lib/solana/networks";
import { tokens } from "@/lib/tokens/config";
import { getSwapReadiness } from "@/lib/swap/provider";
import { useConnectedWallet } from "@solana/kit-plugin-wallet/react";
import { client } from "@/lib/solana/client";
import { fetchLatestSlot } from "@/lib/solana/rpc";

export function DevDiagnostics() {
  const network = getNetworkConfig();
  const connected = useConnectedWallet(client);
  const { data: slot, error: slotError } = useSWR("latest-slot", fetchLatestSlot, { refreshInterval: 15000 });
  const swapReady = getSwapReadiness();

  return (
    <main className="subpage">
      <div className="subpage-header">
        <div>
          <p className="page-kicker">Internal</p>
          <h1>Developer diagnostics</h1>
          <p>Debug information and system status (development only)</p>
        </div>
      </div>

      <div className="dev-notice">
        <AlertCircle size={14} style={{ display: "inline-block", marginRight: "8px", verticalAlign: "middle" }} />
        This page is for development and debugging. It will not appear in production.
      </div>

      <div className="content-grid">
        <section className="surface">
          <div className="surface-pad">
            <h2 className="surface-title">Network status</h2>
            <div className="diagnostics-list">
              <div className="diagnostic-row">
                <span>Network</span>
                <strong>{network.label} ({network.network})</strong>
              </div>
              <div className="diagnostic-row">
                <span>RPC endpoint</span>
                <strong style={{ fontSize: "9px" }}>{network.rpcUrl}</strong>
              </div>
              <div className="diagnostic-row">
                <span>Latest slot</span>
                <strong>{slotError ? `Error: ${slotError instanceof Error ? slotError.message : "RPC unavailable"}` : slot ? `${slot.toLocaleString()}` : "Loading…"}</strong>
              </div>
              <div className="diagnostic-row">
                <span>Explorer</span>
                <strong style={{ fontSize: "9px" }}>{network.explorerUrl}</strong>
              </div>
            </div>
          </div>
        </section>

        <section className="surface">
          <div className="surface-pad">
            <h2 className="surface-title">Program configuration</h2>
            <div className="diagnostics-list">
              <div className="diagnostic-row">
                <span>Program ID</span>
                <strong>{network.programId ? network.programId.slice(0, 8) + "…" : "Not configured"}</strong>
              </div>
              <div className="diagnostic-row">
                <span>cNGN mint</span>
                <strong>{tokens.cngn.mint ? tokens.cngn.mint.slice(0, 8) + "…" : "Not configured"}</strong>
              </div>
              <div className="diagnostic-row">
                <span>cNGN decimals</span>
                <strong>Loaded from token account</strong>
              </div>
              <div className="diagnostic-row">
                <span>Swap provider</span>
                <strong>{swapReady.available ? "Ready" : "Unavailable"}</strong>
              </div>
              <div className="diagnostic-row">
                <span>Transaction simulation</span>
                <strong>No swap instruction configured</strong>
              </div>
            </div>
          </div>
        </section>

        <section className="surface">
          <div className="surface-pad">
            <h2 className="surface-title">Wallet status</h2>
            <div className="diagnostics-list">
              <div className="diagnostic-row">
                <span>Connected</span>
                <strong>{connected ? "Yes" : "No"}</strong>
              </div>
              {connected && (
                <>
                  <div className="diagnostic-row">
                    <span>Wallet</span>
                    <strong>{connected.wallet.name}</strong>
                  </div>
                  <div className="diagnostic-row">
                    <span>Address</span>
                    <strong style={{ fontSize: "9px", fontFamily: "var(--font-geist-mono)" }}>{connected.account.address.slice(0, 8)}…{connected.account.address.slice(-8)}</strong>
                  </div>
                </>
              )}
            </div>
          </div>
        </section>

        <section className="surface">
          <div className="surface-pad">
            <h2 className="surface-title">Supported tokens</h2>
            <div className="diagnostics-list">
              {Object.values(tokens).map((token) => (
                <div key={token.id} className="diagnostic-row">
                  <span>{token.symbol}</span>
                  <strong style={{ fontSize: "9px" }}>
                    {token.decimals !== null ? `${token.decimals} decimals` : "On-chain"}
                    {token.mint ? ` • ${token.mint.slice(0, 6)}…` : ""}
                  </strong>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
