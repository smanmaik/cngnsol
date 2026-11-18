import { createClient } from "@solana/kit";
import { solanaRpc } from "@solana/kit-plugin-rpc";
import { walletSigner } from "@solana/kit-plugin-wallet";
import { getNetworkConfig } from "@/lib/solana/networks";

const network = getNetworkConfig();
export const client = createClient()
  .use(walletSigner({ chain: network.walletChain }))
  .use(solanaRpc({ rpcUrl: network.rpcUrl, transactionConfig: { version: 0 } }));
export type AppClient = Awaited<typeof client>;
