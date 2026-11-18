import { z } from "zod";

const networkSchema = z.enum(["devnet", "testnet", "mainnet-beta"]);
export type SolanaNetwork = z.infer<typeof networkSchema>;

const endpoints: Record<SolanaNetwork, { rpcUrl: string; walletChain: "solana:devnet" | "solana:testnet" | "solana:mainnet"; label: string }> = {
  devnet: { rpcUrl: "https://api.devnet.solana.com", walletChain: "solana:devnet", label: "Devnet" },
  testnet: { rpcUrl: "https://api.testnet.solana.com", walletChain: "solana:testnet", label: "Testnet" },
  "mainnet-beta": { rpcUrl: "https://api.mainnet-beta.solana.com", walletChain: "solana:mainnet", label: "Mainnet" },
};

export function getNetworkConfig() {
  const parsed = networkSchema.safeParse(process.env.NEXT_PUBLIC_SOLANA_NETWORK ?? "devnet");
  const network = parsed.success ? parsed.data : "devnet";
  const defaults = endpoints[network];
  return {
    ...defaults,
    network,
    rpcUrl: process.env.NEXT_PUBLIC_SOLANA_RPC_URL || defaults.rpcUrl,
    explorerUrl: process.env.NEXT_PUBLIC_EXPLORER_URL || "https://explorer.solana.com",
    programId: process.env.NEXT_PUBLIC_PROGRAM_ID || null,
  };
}
