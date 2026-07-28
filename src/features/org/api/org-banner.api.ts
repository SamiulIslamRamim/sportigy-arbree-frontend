import { mockBanner, mockOrganization, mockPlayerCategories, mockPlayers, mockSports, mockVideos } from "#/mock/org";
import type { ExperienceFilterRange, OrganizationBanner, OrganizationProfile, PlayerCategory, PlayerSearchFilter, PlayerSearchResponse, PlayerVideo, Sport, SportKey } from "../types";

export function getOrganizationBanner(): Promise<OrganizationBanner> {
  return Promise.resolve(mockBanner);
}

export function getPlayerCategories(sport: SportKey = "cricket"): Promise<PlayerCategory[]> {
  return Promise.resolve(mockPlayerCategories.filter((c) => c.sport === sport));
}

export function getExperienceFilter(): Promise<ExperienceFilterRange> {
  return Promise.resolve({ min: 1, max: 20 });
}

export function getFeaturedPlayers(filter: PlayerSearchFilter): Promise<PlayerSearchResponse> {
  const {
    sport,
    query = "",
    categoryKeys = [],
    experience,
    sort = "latest",
    page = 1,
    pageSize = 8,
  } = filter;

  let items = mockPlayers.filter((p) => p.sport === sport);

  if (query.trim()) {
    const q = query.trim().toLowerCase();
    items = items.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        (p.academy?.toLowerCase().includes(q) ?? false),
    );
  }

  if (categoryKeys.length > 0) {
    items = items.filter((p) => categoryKeys.includes(p.categoryKey));
  }

  if (experience) {
    items = items.filter(
      (p) => p.experienceYears >= experience.min && p.experienceYears <= experience.max,
    );
  }

  items = [...items].sort((a, b) => {
    switch (sort) {
      case "latest":
        return b.createdAt.localeCompare(a.createdAt);
      case "oldest":
        return a.createdAt.localeCompare(b.createdAt);
      case "highest-rated":
        return b.rating - a.rating;
      case "most-experienced":
        return b.experienceYears - a.experienceYears;
      case "alphabetical":
        return a.name.localeCompare(b.name);
      default:
        return 0;
    }
  });

  const total = items.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const start = (page - 1) * pageSize;
  const paged = items.slice(start, start + pageSize);

  return Promise.resolve({
    items: paged,
    pagination: { page, pageSize, total, totalPages },
  });
}

export function getOrganizationProfile(): Promise<OrganizationProfile> {
  return Promise.resolve(mockOrganization);
}

export function getSports(): Promise<Sport[]> {
  return Promise.resolve(mockSports);
}

export function getOrganizationVideos(sport: SportKey = "cricket"): Promise<PlayerVideo[]> {
  return Promise.resolve(mockVideos.filter((v) => v.sport === sport));
}
