"use client";

import { ClientProvider } from "@solana/react";
import type { ReactNode } from "react";
import { SWRConfig } from "swr";
import { client } from "@/lib/solana/client";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ClientProvider client={client}>
      <SWRConfig value={{ revalidateOnFocus: true, shouldRetryOnError: false }}>
        {children}
      </SWRConfig>
    </ClientProvider>
  );
}
