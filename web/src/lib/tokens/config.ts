import { getNetworkConfig } from "@/lib/solana/networks";

export type TokenId = "cngn" | "sol";
export type TokenConfig = {
  id: TokenId;
  name: string;
  symbol: string;
  decimals: number | null;
  mint: string | null;
  logo: string | null;
  mark: string;
  network: string;
};

const network = getNetworkConfig();

export const tokens: Record<TokenId, TokenConfig> = {
  cngn: {
    id: "cngn",
    name: "cNGN",
    symbol: "cNGN",
    decimals: null,
    mint: process.env.NEXT_PUBLIC_CNGN_MINT || null,
    logo: null,
    mark: "₦",
    network: network.label,
  },
  sol: {
    id: "sol",
    name: "Solana",
    symbol: "SOL",
    decimals: 9,
    mint: null,
    logo: null,
    mark: "◎",
    network: network.label,
  },
};

export const tokenList = Object.values(tokens);
