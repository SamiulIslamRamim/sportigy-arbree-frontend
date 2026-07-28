export type SportKey = "cricket" | "football" | "basketball" | "badminton" | "table-tennis" | "tennis" | "golf" | "volleyball";

export interface Sport {
  key: SportKey;
  label: string;
  enabled: boolean;
}

export interface OrganizationProfile {
  id: string;
  name: string;
  type: string; // e.g. "Cricket Academy"
  logoUrl: string | null;
  address: string;
  city: string;
  country: string;
  verified: boolean;
  memberSince: string; // ISO date
}

export interface OrganizationBanner {
  id: string;
  imageUrl: string | null;
  title: string;
  subtitle: string;
  ctaLabel?: string;
  ctaHref?: string;
}

export interface PlayerVideo {
  id: string;
  thumbnailUrl: string;
  title: string;
  playerName: string;
  durationSec: number;
  views: number;
  sport: SportKey;
}

export interface PlayerCategory {
  key: string;
  label: string;
  sport: SportKey;
}

export interface ExperienceFilterRange {
  min: number;
  max: number;
}

export type PlayerSortKey =
  | "latest"
  | "oldest"
  | "highest-rated"
  | "most-experienced"
  | "alphabetical";

export interface PlayerCardT {
  id: string;
  name: string;
  playingRole: string;
  categoryKey: string;
  sport: SportKey;
  imageUrl: string;
  country: string;
  countryCode: string; // ISO-2 for flag emoji
  experienceYears: number;
  rating: number; // 0-5
  createdAt: string; // ISO date
  academy?: string;
}

export interface PlayerSearchFilter {
  sport: SportKey;
  query?: string;
  categoryKeys?: string[];
  experience?: ExperienceFilterRange;
  sort?: PlayerSortKey;
  page?: number;
  pageSize?: number;
}

export interface Pagination {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export interface PlayerSearchResponse {
  items: PlayerCardT[];
  pagination: Pagination;
}
