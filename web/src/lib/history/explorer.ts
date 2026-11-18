import { getNetworkConfig } from "@/lib/solana/networks";

export function getTransactionExplorerUrl(signature: string) {
  const network = getNetworkConfig();
  const url = new URL(`/tx/${encodeURIComponent(signature)}`, network.explorerUrl);
  if (network.network !== "mainnet-beta") url.searchParams.set("cluster", network.network);
  return url.toString();
}

export function getAddressExplorerUrl(address: string) {
  const network = getNetworkConfig();
  const url = new URL(`/address/${encodeURIComponent(address)}`, network.explorerUrl);
  if (network.network !== "mainnet-beta") url.searchParams.set("cluster", network.network);
  return url.toString();
}
