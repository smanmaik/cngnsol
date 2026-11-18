"use client";

import { ChevronDown, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { tokenList } from "@/lib/tokens/config";
import type { TokenId } from "@/lib/tokens/config";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { useWalletBalance } from "@/hooks/use-wallet-balance";
import { formatUnits } from "@/lib/solana/format";

type Props = {
  selectedToken: TokenId;
  onSelect: (token: TokenId) => void;
};

export function TokenSelector({ selectedToken, onSelect }: Props) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const { balances } = useWalletBalance();
  const selected = tokenList.find((t) => t.id === selectedToken)!;
  const visibleTokens = tokenList.filter((token) => `${token.name} ${token.symbol}`.toLowerCase().includes(search.toLowerCase()));

  return (
    <>
      <Button
        variant="ghost"
        className="token-select"
        onClick={() => setOpen(true)}
      >
        <div className={`token-mark ${selectedToken === "sol" ? "token-mark-sol" : ""}`}>
          {selected.mark}
        </div>
        {selected.symbol}
        <ChevronDown />
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Select a token</DialogTitle>
            <DialogDescription>
              Choose which token to swap.
            </DialogDescription>
          </DialogHeader>

          <label className="relative block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} aria-hidden="true" />
            <Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search tokens" aria-label="Search tokens" className="pl-9" />
          </label>
          <div className="flex flex-col gap-2">
            {visibleTokens.map((token) => (
              <button
                key={token.id}
                className="flex items-center gap-3 p-3 rounded-lg border border-border hover:border-primary/50 hover:bg-accent text-left"
                onClick={() => {
                  onSelect(token.id as TokenId);
                  setSearch("");
                  setOpen(false);
                }}
              >
                <div className={`token-mark ${token.id === "sol" ? "token-mark-sol" : ""}`}>
                  {token.mark}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm">{token.symbol}</div>
                  <div className="text-xs text-muted-foreground">{token.name} · Balance {formatUnits(token.id === "sol" ? balances?.solLamports ?? null : balances?.cngnRaw ?? null, token.id === "sol" ? 9 : balances?.cngnDecimals ?? null)}</div>
                </div>
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
