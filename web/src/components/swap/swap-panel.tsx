"use client";

import { useMemo, useState } from "react";
import { Repeat2, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WalletControl } from "@/components/layout/wallet-control";
import { TokenSelector } from "@/components/swap/token-selector";
import { useConnectedWallet } from "@solana/kit-plugin-wallet/react";
import { client } from "@/lib/solana/client";
import { useWalletBalance } from "@/hooks/use-wallet-balance";
import { getSwapReadiness } from "@/lib/swap/provider";
import { formatUnits, parseUnits } from "@/lib/solana/format";
import { tokens } from "@/lib/tokens/config";
import type { TokenId } from "@/lib/tokens/config";

export function SwapPanel() {
  const [inputToken, setInputToken] = useState<TokenId>("cngn");
  const [outputToken, setOutputToken] = useState<TokenId>("sol");
  const [inputAmount, setInputAmount] = useState("");
  const [slippageBps, setSlippageBps] = useState(50);
  const { balances, isLoading, error: balanceError } = useWalletBalance();
  const connected = useConnectedWallet(client);
  const swapReady = useMemo(() => getSwapReadiness(), []);

  const selectedInputToken = tokens[inputToken];
  const selectedOutputToken = tokens[outputToken];
  const inputDecimals = inputToken === "sol" ? 9 : balances?.cngnDecimals;

  const inputRaw = useMemo(() => {
    if (!inputAmount) return null;
    if (inputDecimals === null || inputDecimals === undefined) return null;
    return parseUnits(inputAmount, inputDecimals);
  }, [inputAmount, inputDecimals]);

  const inputBalanceRaw = inputToken === "sol" ? balances?.solLamports : balances?.cngnRaw;
  const inputBalanceFormatted = formatUnits(
    inputBalanceRaw ?? null,
    inputToken === "sol" ? 9 : (balances?.cngnDecimals ?? null)
  );

  const canSwap = Boolean(
    swapReady.available &&
    !isLoading &&
    balances &&
    inputRaw &&
    inputRaw > 0n &&
    inputBalanceRaw !== null &&
    inputBalanceRaw !== undefined &&
    inputRaw <= inputBalanceRaw
  );

  const outputDisplayed = "—";

  function selectToken(side: "input" | "output", nextToken: TokenId) {
    if (side === "input") {
      if (nextToken === outputToken) setOutputToken(inputToken);
      setInputToken(nextToken);
    } else {
      if (nextToken === inputToken) setInputToken(outputToken);
      setOutputToken(nextToken);
    }
    setInputAmount("");
  }

  function swapTokens() {
    setInputToken(outputToken);
    setOutputToken(inputToken);
    setInputAmount("");
  }

  return (
    <div className="swap-card">
      <div className="swap-card-heading">
        <div>
          <h2>Swap</h2>
          <p>Non-custodial, onchain settlement</p>
        </div>
        <button className="settings-button" aria-label="Swap settings unavailable" disabled title="Swap settings are unavailable until a program adapter is connected"><Settings /></button>
      </div>

      <div className="amount-panel">
        <div className="amount-label-row">
          <span>YOU SELL</span>
          <button disabled={inputBalanceRaw === null || inputBalanceRaw === undefined || isLoading} onClick={() => setInputAmount(inputBalanceFormatted)}>
            Max: {inputBalanceFormatted}
          </button>
        </div>
        <div className="amount-entry">
          <input
            type="text"
            aria-label={`Amount to sell in ${selectedInputToken.symbol}`}
            inputMode="decimal"
            className="amount-input"
            placeholder="0"
            value={inputAmount}
            onChange={(e) => {
              const v = e.target.value.replace(/[^0-9.]/g, "");
              if (v === "" || v === "." || /^\d*\.?\d*$/.test(v)) setInputAmount(v);
            }}
            disabled={!connected || isLoading}
          />
          <TokenSelector selectedToken={inputToken} onSelect={(token) => selectToken("input", token)} />
        </div>
        <div className="amount-subline">
          <span>{selectedInputToken.mark} {selectedInputToken.symbol}</span>
          <span>{selectedInputToken.network}</span>
        </div>
      </div>

      <div className="swap-direction">
        <button onClick={swapTokens} aria-label="Reverse swap tokens"><Repeat2 /></button>
      </div>

      <div className="amount-panel">
        <div className="amount-label-row">
          <span>YOU RECEIVE</span>
        </div>
        <div className="amount-entry">
          <div className="amount-input">{outputDisplayed}</div>
          <TokenSelector selectedToken={outputToken} onSelect={(token) => selectToken("output", token)} />
        </div>
        <div className="amount-subline">
          <span>{selectedOutputToken.mark} {selectedOutputToken.symbol}</span>
          <span>{selectedOutputToken.network}</span>
        </div>
      </div>

      {!swapReady.available && (
        <div className="quote-status">
          <span>ℹ︎</span>
          <span>{swapReady.reason}</span>
        </div>
      )}

      {balanceError && connected && (
        <p className="inline-error" role="status">Unable to load wallet balances from Solana. Check the selected network and RPC endpoint.</p>
      )}

      <div className="quote-row" style={{ marginTop: "16px" }}>
        <span>Slippage tolerance</span>
        <div className="slippage-control">
          {[25, 50, 100].map((bp) => (
            <button
              key={bp}
              className="slippage-option"
              aria-pressed={slippageBps === bp}
              onClick={() => setSlippageBps(bp)}
            >
              {bp / 100}%
            </button>
          ))}
        </div>
      </div>

      {!connected ? (
        <WalletControl className="swap-cta" label="Connect wallet" />
      ) : (
        <Button disabled={!canSwap} className="swap-cta">
          {!balances || isLoading ? "Loading balances…" : !swapReady.available ? "Swap unavailable" : !canSwap ? "Enter a valid amount" : "Review swap"}
        </Button>
      )}

      <p className="swap-footnote">Your wallet signs every transaction. AI HUB never holds your keys or funds.</p>
    </div>
  );
}
