import { getNetworkConfig } from "@/lib/solana/networks";

export function DocsContent() {
  const network = getNetworkConfig();

  return (
    <main className="subpage">
      <div className="subpage-header">
        <div>
          <p className="page-kicker">Help</p>
          <h1>Documentation</h1>
          <p>Setup, configuration, and integration guide.</p>
        </div>
      </div>

      <div className="docs-layout">
        <div className="docs-index">
          <strong>Contents</strong>
          <a href="#setup">Local setup</a>
          <a href="#wallet">Wallet setup</a>
          <a href="#network">Network configuration</a>
          <a href="#architecture">Architecture</a>
          <a href="#cngn">cNGN configuration</a>
          <a href="#program">Program integration</a>
          <a href="#swap-flow">Swap flow</a>
          <a href="#env">Environment variables</a>
          <a href="#testing">Testing</a>
          <a href="#deployment">Deployment</a>
          <a href="#security">Security</a>
        </div>

        <div className="docs-content">
          <section className="surface docs-section" id="setup">
            <h2>Local setup</h2>
            <p>From the repository root, enter the web app directory and start the frontend:</p>
            <ul>
              <li><code>cd web</code> — Enter the Next.js frontend</li>
              <li><code>pnpm install</code> — Install dependencies (the repository includes <code>pnpm-lock.yaml</code>)</li>
              <li><code>pnpm run dev</code> — Start the development server</li>
              <li>Open <code>http://localhost:3000</code> in your browser</li>
            </ul>
          </section>

          <section className="surface docs-section" id="wallet">
            <h2>Wallet setup</h2>
            <p>Connect your Solana wallet:</p>
            <ul>
              <li>Install Phantom, Solflare, Backpack, or another Solana Wallet Standard wallet</li>
              <li>Create or import a wallet</li>
              <li>Return to AI HUB cNGN Swap and click &quot;Connect wallet&quot;</li>
              <li>Approve the connection in your wallet</li>
            </ul>
            <p>Your private keys remain in your wallet at all times. AI HUB never has access to them.</p>
          </section>

          <section className="surface docs-section" id="network">
            <h2>Network configuration</h2>
            <p><strong>Current network:</strong> {network.label}</p>
            <p>Switch networks by setting <code>NEXT_PUBLIC_SOLANA_NETWORK</code>:</p>
            <ul>
              <li><code>devnet</code> (default)</li>
              <li><code>testnet</code></li>
              <li><code>mainnet-beta</code></li>
            </ul>
            <p>The application will use the official RPC endpoint for the selected network unless <code>NEXT_PUBLIC_SOLANA_RPC_URL</code> is set. Any <code>NEXT_PUBLIC_</code> value is exposed to browser code; never put a private RPC credential or secret in this variable. Use a server-side proxy for private RPC credentials.</p>
          </section>

          <section className="surface docs-section" id="architecture">
            <h2>Architecture</h2>
            <ul>
              <li>Next.js App Router provides the landing, swap, dashboard, history, receive, docs, and development diagnostics routes.</li>
              <li>Solana Kit with Wallet Standard discovers compatible browser wallets; no wallet-specific key handling is used.</li>
              <li>SWR reads balances and signatures from the configured Solana RPC endpoint.</li>
              <li>The swap provider interface is intentionally unimplemented until the repository&apos;s program and quote source are available.</li>
            </ul>
          </section>

          <section className="surface docs-section" id="cngn">
            <h2>cNGN configuration</h2>
            <p>Set <code>NEXT_PUBLIC_CNGN_MINT</code> to the verified SPL mint for the selected Solana network. The application does not contain a default cNGN mint. Token decimals are read from the mint/token accounts on chain; amounts are handled as integer base units.</p>
            <p>Only configure a mint after confirming its address and network with the cNGN issuer or the existing program deployment configuration.</p>
          </section>

          <section className="surface docs-section" id="program">
            <h2>Program integration</h2>
            <p>To enable swap functionality, configure these environment variables:</p>
            <table className="env-table">
              <thead>
                <tr>
                  <th>Variable</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><code>NEXT_PUBLIC_PROGRAM_ID</code></td>
                  <td>The Solana program ID of the deployed cNGN swap contract</td>
                </tr>
                <tr>
                  <td><code>NEXT_PUBLIC_CNGN_MINT</code></td>
                  <td>The SPL token mint address of cNGN</td>
                </tr>
              </tbody>
            </table>
            <p>These values alone do not enable swaps. This checkout does not include the Anchor program, IDL, generated client, deployed address, or liquidity/quote service. The exact instruction, account layouts, PDA seeds, and quote source must be supplied before a real quote or transaction adapter can be implemented safely. No transaction is simulated by this app.</p>
          </section>

          <section className="surface docs-section" id="swap-flow">
            <h2>Swap flow</h2>
            <p>The intended flow is: load a wallet-scoped quote, validate token addresses and integer amounts, show minimum received and fees, build the repository-defined instruction, simulate it, request wallet signature, send, confirm, and refresh balances.</p>
            <p>This flow is not active yet: the checked-out repository contains no swap program, IDL, account/PDA definitions, or quote service. The interface stays disabled rather than producing a made-up quote or transaction.</p>
          </section>

          <section className="surface docs-section" id="env">
            <h2>All environment variables</h2>
            <table className="env-table">
              <thead>
                <tr>
                  <th>Variable</th>
                  <th>Default</th>
                  <th>Purpose</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><code>NEXT_PUBLIC_SOLANA_NETWORK</code></td>
                  <td><code>devnet</code></td>
                  <td>Solana network</td>
                </tr>
                <tr>
                  <td><code>NEXT_PUBLIC_SOLANA_RPC_URL</code></td>
                  <td>Official endpoint</td>
                  <td>Custom RPC endpoint (optional)</td>
                </tr>
                <tr>
                  <td><code>NEXT_PUBLIC_CNGN_MINT</code></td>
                  <td><code>null</code></td>
                  <td>cNGN token mint address</td>
                </tr>
                <tr>
                  <td><code>NEXT_PUBLIC_PROGRAM_ID</code></td>
                  <td><code>null</code></td>
                  <td>Swap program ID</td>
                </tr>
                <tr>
                  <td><code>NEXT_PUBLIC_EXPLORER_URL</code></td>
                  <td>Solana Explorer</td>
                  <td>Custom block explorer URL</td>
                </tr>
                <tr>
                  <td><code>key</code></td>
                  <td>Required for market prices</td>
                  <td>Server-side CoinGecko Demo API key</td>
                </tr>
              </tbody>
            </table>
          </section>

          <section className="surface docs-section" id="testing">
            <h2>Testing</h2>
            <p>To test without a deployed program:</p>
            <ul>
              <li>Connect your wallet — your SOL and cNGN balances will display if the tokens are configured</li>
              <li>View your portfolio and transaction history on-chain</li>
              <li>To add swaps, provide the deployed program address, IDL or generated client, cNGN mint, account/PDA derivation rules, and the quote/liquidity service specification</li>
            </ul>
            <p>Wallet balances and recent signatures are read from the selected Solana RPC when available. Without the program interface, transaction history cannot be classified as swaps or decoded into token amounts. The application will never fake quotes, balances, signatures, or successful transactions.</p>
          </section>

          <section className="surface docs-section" id="deployment">
            <h2>Deployment</h2>
            <p>Deploy the <code>web</code> directory as the Vercel project root. Add the selected network, verified cNGN mint, program ID, RPC endpoint, and explorer URL in Vercel project environment settings before deploying.</p>
            <p>Values prefixed with <code>NEXT_PUBLIC_</code> are shipped to browsers. Never put private RPC credentials, API tokens, or wallet secrets in them. The live market panel reads the CoinGecko Demo API key from the server-only <code>key</code> variable. Use a server-side proxy for any credentialed RPC endpoint.</p>
          </section>

          <section className="surface docs-section" id="security">
            <h2>Security notes</h2>
            <ul>
              <li>The app never requests, stores, or transmits wallet seed phrases or private keys.</li>
              <li>Balances are read from RPC and quotes are not simulated.</li>
              <li>Transactions are not built or signed until the deployed program interface is integrated and verified.</li>
              <li>Review all transaction instructions in the wallet before signing; this app makes no audit or risk-free claims.</li>
            </ul>
          </section>
        </div>
      </div>
    </main>
  );
}
