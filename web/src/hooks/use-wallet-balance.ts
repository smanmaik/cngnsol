import { useConnectedWallet } from "@solana/kit-plugin-wallet/react";
import useSWR from "swr";
import { client } from "@/lib/solana/client";
import { fetchWalletBalances, type WalletBalances } from "@/lib/solana/rpc";

export function useWalletBalance() {
  const connected = useConnectedWallet(client);
  const address = connected?.account.address;
  const key = address ? (["wallet-balance", address] as const) : null;
  const { data, isLoading, error } = useSWR<WalletBalances, Error, readonly ["wallet-balance", string] | null>(
    key,
    (k) => fetchWalletBalances(k[1]),
    {
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
      dedupingInterval: 1000,
      focusThrottleInterval: 30000,
      refreshInterval: 15000,
    }
  );

  return {
    balances: data,
    isLoading: isLoading && !error,
    error,
  };
}
