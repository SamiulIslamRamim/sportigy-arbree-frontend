import { useSportProfiles } from "./useSportProfiles";
import { useEffect, useState } from "react";

const SPORT_KEY = "player.dashboard.sportId";

export function useSelectedSport() {
  const { data: profiles } = useSportProfiles();
  const [sportId, setSportId] = useState<string>(() => localStorage.getItem(SPORT_KEY) ?? "");

  useEffect(() => {
    if (!sportId && profiles?.length) setSportId(profiles[0].sportId);
  }, [profiles, sportId]);

  useEffect(() => {
    if (sportId) localStorage.setItem(SPORT_KEY, sportId);
  }, [sportId]);

  return { sportId, setSportId, profiles: profiles ?? [] };
}
