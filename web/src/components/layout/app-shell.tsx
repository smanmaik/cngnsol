import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, BookOpen, Code2, LayoutDashboard, ReceiptText, Repeat2, WalletCards } from "lucide-react";
import type { ReactNode } from "react";
import { WalletControl } from "@/components/layout/wallet-control";
import { getNetworkConfig } from "@/lib/solana/networks";

const navigation = [
  { href: "/", label: "Swap", icon: Repeat2 },
  { href: "/dashboard", label: "Portfolio", icon: LayoutDashboard },
  { href: "/history", label: "Activity", icon: ReceiptText },
  { href: "/receive", label: "Receive", icon: WalletCards },
];

export function AppShell({ children }: { children: ReactNode }) {
  const network = getNetworkConfig();
  return (
    <div className="app-frame">
      <header className="topbar">
        <Link href="/" className="brand" aria-label="AI HUB cNGN Swap home">
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/file_00000000765081f48e43077edec9ccbd%281%29-dAJyvu5rELrsCHpqrtKrYKcE6OGa9l.png"
            alt=""
            width={44}
            height={40}
            unoptimized
            className="brand-image"
          />
          <span className="brand-type"><strong>AI HUB</strong><small>cNGN SWAP</small></span>
        </Link>
        <nav className="desktop-nav" aria-label="Main navigation">
          {navigation.map(({ href, label, icon: Icon }) => (
            <Link key={href} href={href} className="nav-link"><Icon aria-hidden="true" />{label}</Link>
          ))}
        </nav>
        <div className="topbar-actions">
          <div className="network-pill"><span className="network-dot" />{network.label}</div>
          <WalletControl />
        </div>
      </header>
      {children}
      <footer className="footer">
        <div className="footer-brand"><span className="footer-mark">AI</span><div><strong>AI HUB</strong><span>Building useful technology for Africa.</span></div></div>
        <div className="footer-links">
          <Link href="/docs"><BookOpen />Documentation</Link>
          <a href="https://github.com/smanmaik/cngnsol" target="_blank" rel="noreferrer"><Code2 />Program repository <ArrowUpRight /></a>
        </div>
        <div className="footer-meta"><span>Built on Solana</span><span>cNGN infrastructure</span></div>
      </footer>
      <nav className="mobile-nav" aria-label="Mobile navigation">
        {navigation.map(({ href, label, icon: Icon }) => (
          <Link key={href} href={href} className="mobile-nav-link"><Icon aria-hidden="true" /><span>{label}</span></Link>
        ))}
      </nav>
    </div>
  );
}
