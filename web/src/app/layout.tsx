import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AppShell } from "@/components/layout/app-shell";
import { Providers } from "./providers";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "AI HUB cNGN Swap — Swap Naira. Move Onchain.",
    template: "%s | AI HUB cNGN Swap",
  },
  description: "A simple, non-custodial Solana experience for cNGN and SOL. Connect a wallet, view onchain balances, and verify activity on Solana.",
  applicationName: "AI HUB cNGN Swap",
  openGraph: {
    title: "AI HUB cNGN Swap",
    description: "Swap Naira. Move Onchain.",
    siteName: "AI HUB cNGN Swap",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#080c0e",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full">
        <Providers>
          <AppShell>{children}</AppShell>
        </Providers>
      </body>
    </html>
  );
}
