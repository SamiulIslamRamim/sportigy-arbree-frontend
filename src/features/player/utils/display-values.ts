export const EMPTY_VALUE = "--";

export function displayValue(
  value: string | number | null | undefined,
): string {
  if (value === null || value === undefined) return EMPTY_VALUE;
  if (typeof value === "number") {
    return Number.isFinite(value) ? String(value) : EMPTY_VALUE;
  }
  const trimmed = value.trim();
  return trimmed.length === 0 ? EMPTY_VALUE : trimmed;
}

export function formatAddress(parts: {
  city: string | null;
  state: string | null;
  country: string | null;
}): string {
  const items = [parts.city, parts.state, parts.country]
    .map((p) => (p ?? "").trim())
    .filter((p) => p.length > 0);
  return items.length === 0 ? EMPTY_VALUE : items.join(", ");
}

export function formatMeasurement(
  value: string | null | undefined,
  unit: string,
): string {
  if (!value) return EMPTY_VALUE;
  const trimmed = value.trim();
  if (!trimmed) return EMPTY_VALUE;
  if (/[a-zA-Z]/.test(trimmed)) return trimmed;
  return `${trimmed} ${unit}`;
}