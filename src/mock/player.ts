import type { PlayerProfile } from "#/features/player/types";

export const mockPlayer: PlayerProfile = {
  id: "plr_001",

  fullName: "Cameron Williamson",
  weightKg: 73,
  heightCm: 178,
  birthDate: "1990-10-13",
  address: "Dhaka, Bangladesh",
  playingRole: "Wicket Keeper",
  battingStyle: "Right-hand bat",
  bowlingStyle: "Right-arm off-break",
  academy: "BCB Academy",

  // avatarUrl:
  //   "https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=400&q=80",

  countryCode: "BD",
  countryName: "Bangladesh",
  countryFlagUrl: "https://flagcdn.com/w80/bd.png",
  
  teamName: "BCB Academy",
  teamLogoUrl: "https://api.dicebear.com/7.x/shapes/svg?seed=BCB",
  age: 34,
};