export function formatUnits(raw: bigint | null, decimals: number | null, maxFractionDigits = 4): string {
  if (raw === null || decimals === null) return "—";
  const negative = raw < 0n;
  const digits = (negative ? -raw : raw).toString().padStart(decimals + 1, "0");
  const whole = decimals === 0 ? digits : digits.slice(0, -decimals) || "0";
  const fraction = decimals === 0 ? "" : digits.slice(-decimals).slice(0, maxFractionDigits).replace(/0+$/, "");
  const groupedWhole = new Intl.NumberFormat("en-NG", { maximumFractionDigits: 0 }).format(BigInt(whole));
  return `${negative ? "-" : ""}${groupedWhole}${fraction ? `.${fraction}` : ""}`;
}

export function parseUnits(value: string, decimals: number): bigint | null {
  if (!/^\d*(?:\.\d*)?$/.test(value) || value === "" || value === ".") return null;
  const [whole = "0", fraction = ""] = value.split(".");
  if (fraction.length > decimals) return null;
  return BigInt(whole || "0") * 10n ** BigInt(decimals) + BigInt((fraction + "0".repeat(decimals)).slice(0, decimals) || "0");
}

export function shortenAddress(value: string, edge = 4) {
  return value.length > edge * 2 + 3 ? `${value.slice(0, edge)}…${value.slice(-edge)}` : value;
}
