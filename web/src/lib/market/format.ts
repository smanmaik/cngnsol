export function formatUsd(value: number): string {
  if (!Number.isFinite(value)) return "—";

  const maximumFractionDigits = value >= 1 ? 2 : value >= 0.01 ? 4 : 8;

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits,
  }).format(value);
}

export function formatPercentage(value: number): string {
  const sign = value >= 0 ? "+" : "−";
  return `${sign}${Math.abs(value).toFixed(2)}%`;
}
