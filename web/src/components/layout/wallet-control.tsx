"use client";

import { useState } from "react";
import { Check, Copy, ExternalLink, LoaderCircle, Wallet2 } from "lucide-react";
import { useConnect, useConnectedWallet, useDisconnect, useWallets } from "@solana/kit-plugin-wallet/react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { client } from "@/lib/solana/client";
import { shortenAddress } from "@/lib/solana/format";
import { getAddressExplorerUrl } from "@/lib/history/explorer";

export function WalletControl({ className, label }: { className?: string; label?: string }) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const wallets = useWallets(client);
  const connected = useConnectedWallet(client);
  const { dispatchAsync: connect, isRunning: connecting } = useConnect(client);
  const { dispatchAsync: disconnect, isRunning: disconnecting } = useDisconnect(client);

  async function copyAddress() {
    if (!connected) return;
    await navigator.clipboard.writeText(connected.account.address);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  async function connectWallet(wallet: (typeof wallets)[number]) {
    setError(null);
    try {
      await connect(wallet);
    } catch (caught) {
      const message = caught instanceof Error ? caught.message : "Wallet connection was not completed.";
      setError(/reject|declin|cancel/i.test(message) ? "Connection was cancelled in your wallet." : message);
    }
  }

  async function disconnectWallet() {
    setError(null);
    try {
      await disconnect();
      setOpen(false);
    } catch {
      setError("The wallet could not be disconnected. Try again.");
    }
  }

  return (
    <>
      <Button className={`wallet-trigger ${className ?? ""}`} onClick={() => setOpen(true)}>
        <Wallet2 data-icon="inline-start" />
        {connected ? shortenAddress(connected.account.address) : label ?? "Connect wallet"}
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="wallet-dialog">
          <DialogHeader>
            <DialogTitle>{connected ? "Wallet connected" : "Connect a wallet"}</DialogTitle>
            <DialogDescription>{connected ? "Your wallet signs every transaction. AI HUB never has access to your keys." : "Choose a Solana wallet. Your private keys stay in your wallet."}</DialogDescription>
          </DialogHeader>
          {connected ? (
            <div className="wallet-detail">
              <div className="wallet-address-card"><span className="wallet-avatar">{connected.wallet.name.slice(0, 1)}</span><div><strong>{connected.wallet.name}</strong><span>{shortenAddress(connected.account.address, 6)}</span></div></div>
              <div className="wallet-modal-actions">
                <Button variant="outline" onClick={copyAddress}>{copied ? <Check data-icon="inline-start" /> : <Copy data-icon="inline-start" />}{copied ? "Copied" : "Copy address"}</Button>
                <a className="button button-secondary wallet-action-link" href={getAddressExplorerUrl(connected.account.address)} target="_blank" rel="noreferrer">Explorer <ExternalLink /></a>
                <Button variant="outline" disabled={disconnecting} onClick={disconnectWallet}>Disconnect</Button>
              </div>
            </div>
          ) : (
            <div className="wallet-list">
              {wallets.length === 0 ? <p className="wallet-empty">No compatible wallet found. Install Phantom, Solflare, Backpack, or another Solana Wallet Standard wallet, then refresh.</p> : wallets.map((wallet) => (
                <button className="wallet-option" key={wallet.name} disabled={connecting} onClick={() => connectWallet(wallet)}>
                  <span className="wallet-avatar">{wallet.name.slice(0, 1)}</span><span>{wallet.name}</span>{connecting ? <LoaderCircle className="spin-icon" /> : <span className="wallet-option-arrow">↗</span>}
                </button>
              ))}
            </div>
          )}
          {error && <p className="inline-error" role="alert">{error}</p>}
        </DialogContent>
      </Dialog>
    </>
  );
}
