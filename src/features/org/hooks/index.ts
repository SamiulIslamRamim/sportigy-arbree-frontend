import { keepPreviousData, useQuery } from "@tanstack/react-query";
import type { PlayerSearchFilter, SportKey } from "../types";
import { getExperienceFilter, getFeaturedPlayers, getOrganizationBanner, getOrganizationProfile, getOrganizationVideos, getPlayerCategories, getSports } from "../api/org-banner.api";

export const orgQueryKeys = {
  profile: ["org", "profile"] as const,
  banner: ["org", "banner"] as const,
  sports: ["org", "sports"] as const,
  videos: (sport: SportKey) => ["org", "videos", sport] as const,
  categories: (sport: SportKey) => ["org", "categories", sport] as const,
  experience: ["org", "experience-range"] as const,
  players: (filter: PlayerSearchFilter) => ["org", "players", filter] as const,
};

export function useOrganizationProfile() {
  return useQuery({ queryKey: orgQueryKeys.profile, queryFn: getOrganizationProfile });
}

export function useOrganizationBanner() {
  return useQuery({ queryKey: orgQueryKeys.banner, queryFn: getOrganizationBanner });
}

export function useSports() {
  return useQuery({ queryKey: orgQueryKeys.sports, queryFn: getSports });
}

export function useOrganizationVideos(sport: SportKey) {
  return useQuery({
    queryKey: orgQueryKeys.videos(sport),
    queryFn: () => getOrganizationVideos(sport),
  });
}

export function usePlayerCategories(sport: SportKey) {
  return useQuery({
    queryKey: orgQueryKeys.categories(sport),
    queryFn: () => getPlayerCategories(sport),
  });
}

export function useExperienceFilter() {
  return useQuery({ queryKey: orgQueryKeys.experience, queryFn: getExperienceFilter });
}

export function usePlayers(filter: PlayerSearchFilter) {
  return useQuery({
    queryKey: orgQueryKeys.players(filter),
    queryFn: () => getFeaturedPlayers(filter),
    placeholderData: keepPreviousData,
  });
}