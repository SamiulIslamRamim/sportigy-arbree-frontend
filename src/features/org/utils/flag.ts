export function countryFlagEmoji(code: string): string {
  if (!code || code.length !== 2) return "🏳️";
  const base = 0x1f1e6;
  const A = "A".charCodeAt(0);
  return String.fromCodePoint(
    base + code.toUpperCase().charCodeAt(0) - A,
    base + code.toUpperCase().charCodeAt(1) - A,
  );
}
