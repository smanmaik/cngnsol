"use client";

import { useState } from "react";
import { Copy, Check, AlertCircle, Share2 } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { Button } from "@/components/ui/button";
import { useConnectedWallet } from "@solana/kit-plugin-wallet/react";
import { client } from "@/lib/solana/client";

export function ReceiveContent() {
  const connected = useConnectedWallet(client);
  const [copied, setCopied] = useState(false);

  if (!connected) {
    return (
      <main className="subpage">
        <section className="surface surface-pad">
          <div className="empty-state">
            <span>⬇</span>
            <strong>Wallet not connected</strong>
            <p>Connect a Solana wallet to receive assets.</p>
          </div>
        </section>
      </main>
    );
  }

  async function copyAddress() {
    if (!connected) return;
    await navigator.clipboard.writeText(connected.account.address);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  }

  async function shareAddress() {
    if (!connected) return;
    if (navigator.share) {
      await navigator.share({ title: "My Solana wallet", text: connected.account.address });
    } else {
      await copyAddress();
    }
  }

  return (
    <main className="subpage">
      <div className="subpage-header">
        <div>
          <p className="page-kicker">Account</p>
          <h1>Receive assets</h1>
          <p>Share your wallet address to receive SOL and cNGN</p>
        </div>
      </div>

      <section className="surface">
        <div className="receive-card">
          <h2 className="surface-title">Your receiving address</h2>
          <p className="surface-description" style={{ marginTop: "8px" }}>
            Only send Solana-based assets to this address.
          </p>

          <div className="qr-wrap">
            <QRCodeSVG value={connected.account.address} size={176} level="M" includeMargin aria-label="QR code for your Solana wallet address" />
          </div>

          <div className="receive-address">
            {connected.account.address}
          </div>

          <div className="flex flex-col gap-2" style={{ marginTop: "16px" }}>
            <Button
              onClick={copyAddress}
              className="w-full"
            >
              {copied ? (
                <>
                  <Check size={16} />
                  Copied to clipboard
                </>
              ) : (
                <>
                  <Copy size={16} />
                  Copy address
                </>
              )}
            </Button>
            <Button variant="outline" onClick={shareAddress} className="w-full">
              <Share2 size={16} />
              Share address
            </Button>
          </div>

          <div className="receive-warning">
            <AlertCircle size={14} style={{ display: "inline-block", marginRight: "6px", verticalAlign: "middle" }} />
            Only send Solana (SOL), cNGN, and other Solana Program Library (SPL) tokens to this address. Sending other assets will result in permanent loss.
          </div>
        </div>
      </section>
    </main>
  );
}
