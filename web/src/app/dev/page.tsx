import { notFound } from "next/navigation";
import { DevDiagnostics } from "@/components/dev/dev-diagnostics";

export const metadata = {
  title: "Developer Diagnostics",
  description: "Internal diagnostics for AI HUB cNGN Swap.",
};

export default function DevPage() {
  if (process.env.NODE_ENV !== "development") notFound();
  return <DevDiagnostics />;
}
