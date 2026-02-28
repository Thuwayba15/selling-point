/**
 * Format currency values intelligently:
 * - < 1M: R123,456.78
 * - >= 1M and < 1B: R123.45M
 * - >= 1B: R1.23B
 */
export function formatCurrency(value: number | undefined | null): string {
  if (value === undefined || value === null || isNaN(value)) {
    return "R0.00";
  }

  const absValue = Math.abs(value);
  const sign = value < 0 ? "-" : "";

  // Values >= 1 billion
  if (absValue >= 1_000_000_000) {
    return `${sign}R${(absValue / 1_000_000_000).toFixed(2)}B`;
  }

  // Values >= 1 million
  if (absValue >= 1_000_000) {
    return `${sign}R${(absValue / 1_000_000).toFixed(2)}M`;
  }

  // Values < 1 million - show with commas
  return `${sign}R${absValue.toLocaleString("en-ZA", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

/**
 * Format percentage values
 */
export function formatPercentage(value: number | undefined | null): string {
  if (value === undefined || value === null || isNaN(value)) {
    return "0.0%";
  }
  return `${value.toFixed(1)}%`;
}
