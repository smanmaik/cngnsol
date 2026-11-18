import { MarketOverview } from "@/components/market/market-overview";
import { SwapPanel } from "@/components/swap/swap-panel";

export default function HomePage() {
  return (
    <main className="page-wrap">
      <section className="hero-grid" aria-labelledby="hero-heading">
        <div className="hero-copy">
          <div className="eyebrow"><span className="eyebrow-dot" /> Solana, made local</div>
          <h1 id="hero-heading">cNGN <span>↔</span> SOL,<br />made simple.</h1>
          <p className="hero-description">Swap Naira-backed digital assets and SOL directly on Solana. Your wallet stays yours at every step.</p>
          <div className="hero-actions">
            <a className="button button-primary" href="#swap">Launch swap <span aria-hidden="true">↗</span></a>
            <a className="button button-secondary" href="/docs">How it works</a>
          </div>
          <div className="hero-proof">
            <span className="proof-mark">◎</span>
            <span>Built on Solana</span>
            <span className="proof-divider" />
            <span>Non-custodial by design</span>
          </div>
        </div>
        <div id="swap" className="swap-anchor"><SwapPanel /></div>
      </section>
      <section className="trust-strip" aria-label="Product principles">
        <div><span className="strip-icon">↗</span><div><strong>Fast settlement</strong><span>Built on Solana</span></div></div>
        <div><span className="strip-icon">₦</span><div><strong>Naira-native</strong><span>Designed around cNGN</span></div></div>
        <div><span className="strip-icon">⌁</span><div><strong>Non-custodial</strong><span>You control your wallet</span></div></div>
        <div><span className="strip-icon">↗</span><div><strong>Onchain activity</strong><span>Verifiable on Explorer</span></div></div>
      </section>
      <MarketOverview />
      <section className="below-fold">
        <div>
          <p className="section-kicker">A clearer way to move value</p>
          <h2>From naira-backed tokens<br />to the Solana economy.</h2>
        </div>
        <p className="below-copy">Connect a compatible wallet to see your live balances. Swap quotes and execution will unlock when the cNGN program and liquidity adapter are configured.</p>
      </section>
    </main>
  );
}
