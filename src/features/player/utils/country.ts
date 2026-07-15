const COUNTRY_CODES: Record<string, string> = {
  bangladesh: "BD",
  india: "IN",
  australia: "AU",
  england: "GB",
  "united kingdom": "GB",
  pakistan: "PK",
  "south africa": "ZA",
  "new zealand": "NZ",
  "sri lanka": "LK",
  afghanistan: "AF",
  "west indies": "JM",
  zimbabwe: "ZW",
  ireland: "IE",
  netherlands: "NL",
};

export function getCountryCode(country: string | null | undefined): string | null {
  if (!country) return null;
  const key = country.trim().toLowerCase();
  return COUNTRY_CODES[key] ?? null;
}

export function getCountryFlagUrl(
  country: string | null | undefined,
): string | null {
  const code = getCountryCode(country);
  if (!code) return null;
  return `https://flagcdn.com/w80/${code.toLowerCase()}.png`;
}
