import { getCountryCallingCode, isValidPhoneNumber } from "libphonenumber-js";
import type{ CountryCode } from "libphonenumber-js/core";

// import { getCountryCallingCode, isValidPhoneNumber } from "libphonenumber-js/core";

const COUNTRY_CODES: Record<string, string> = {
  afghanistan: "AF",
  albania: "AL",
  algeria: "DZ",
  andorra: "AD",
  angola: "AO",
  argentina: "AR",
  australia: "AU",
  austria: "AT",
  bahamas: "BS",
  bahrain: "BH",
  bangladesh: "BD",
  barbados: "BB",
  belgium: "BE",
  bhutan: "BT",
  bolivia: "BO",
  "bosnia and herzegovina": "BA",
  brazil: "BR",
  brunei: "BN",
  bulgaria: "BG",
  cambodia: "KH",
  cameroon: "CM",
  canada: "CA",
  chile: "CL",
  china: "CN",
  colombia: "CO",
  "costa rica": "CR",
  croatia: "HR",
  cuba: "CU",
  cyprus: "CY",
  czechia: "CZ",
  denmark: "DK",
  "dominican republic": "DO",
  ecuador: "EC",
  egypt: "EG",
  "el salvador": "SV",
  england: "GB",
  estonia: "EE",
  ethiopia: "ET",
  fiji: "FJ",
  finland: "FI",
  france: "FR",
  germany: "DE",
  ghana: "GH",
  greece: "GR",
  guatemala: "GT",
  guyana: "GY",
  haiti: "HT",
  honduras: "HN",
  "hong kong": "HK",
  hungary: "HU",
  iceland: "IS",
  india: "IN",
  indonesia: "ID",
  iran: "IR",
  iraq: "IQ",
  ireland: "IE",
  israel: "IL",
  italy: "IT",
  jamaica: "JM",
  japan: "JP",
  jordan: "JO",
  kazakhstan: "KZ",
  kenya: "KE",
  kuwait: "KW",
  kyrgyzstan: "KG",
  laos: "LA",
  latvia: "LV",
  lebanon: "LB",
  liechtenstein: "LI",
  lithuania: "LT",
  luxembourg: "LU",
  macao: "MO",
  madagascar: "MG",
  malaysia: "MY",
  maldives: "MV",
  malta: "MT",
  mexico: "MX",
  moldova: "MD",
  monaco: "MC",
  mongolia: "MN",
  montenegro: "ME",
  morocco: "MA",
  myanmar: "MM",
  nepal: "NP",
  netherlands: "NL",
  "new zealand": "NZ",
  nicaragua: "NI",
  nigeria: "NG",
  "north korea": "KP",
  norway: "NO",
  oman: "OM",
  pakistan: "PK",
  panama: "PA",
  "papua new guinea": "PG",
  paraguay: "PY",
  peru: "PE",
  philippines: "PH",
  poland: "PL",
  portugal: "PT",
  qatar: "QA",
  romania: "RO",
  russia: "RU",
  samoa: "WS",
  "san marino": "SM",
  "saudi arabia": "SA",
  senegal: "SN",
  serbia: "RS",
  singapore: "SG",
  slovakia: "SK",
  slovenia: "SI",
  "south africa": "ZA",
  "south korea": "KR",
  spain: "ES",
  "sri lanka": "LK",
  sudan: "SD",
  sweden: "SE",
  switzerland: "CH",
  syria: "SY",
  taiwan: "TW",
  tajikistan: "TJ",
  tanzania: "TZ",
  thailand: "TH",
  "trinidad and tobago": "TT",
  tunisia: "TN",
  turkey: "TR",
  uganda: "UG",
  ukraine: "UA",
  "united arab emirates": "AE",
  "united kingdom": "GB",
  "united states": "US",
  uruguay: "UY",
  uzbekistan: "UZ",
  venezuela: "VE",
  vietnam: "VN",
  "west indies": "JM",
  yemen: "YE",
  zambia: "ZM",
  zimbabwe: "ZW",
};

export const COUNTRY_LIST = Object.keys(COUNTRY_CODES).map((key) => ({
  value: key,
  label: key.charAt(0).toUpperCase() + key.slice(1), 
}));

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

export function getDynamicPrefix(countryCode: string | null | undefined): string {
  if (!countryCode) return "";
  try {
    return `+${getCountryCallingCode(countryCode.toUpperCase() as CountryCode)}`;
  } catch {
    return "";
  }
}

export function validatePhoneNumber(
  countryCode: string | null | undefined,
  phoneNumber: string | null | undefined
): boolean {
  if (!countryCode || !phoneNumber) return false;
  try {
    return isValidPhoneNumber(phoneNumber, countryCode.toUpperCase() as CountryCode);
  } catch {
    return false;
  }
}