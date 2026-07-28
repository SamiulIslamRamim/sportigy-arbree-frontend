import type { OrganizationBanner, OrganizationProfile, PlayerCardT, PlayerCategory, PlayerVideo, Sport } from "#/features/org/types";

export const mockOrganization: OrganizationProfile = {
  id: "org_1",
  name: "Bengal Tigers Cricket Academy",
  type: "Cricket Academy",
  logoUrl: null,
  address: "Mirpur, Dhaka",
  city: "Dhaka",
  country: "Bangladesh",
  verified: true,
  memberSince: "2021-04-12",
};

export const mockBanner: OrganizationBanner = {
  id: "banner_1",
  imageUrl: null,
  title: "Trial Season Now Open",
  subtitle: "Discover, evaluate and recruit rising cricket talent across the region.",
  ctaLabel: "Learn more",
  ctaHref: "#",
};

export const mockSports: Sport[] = [
  { key: "cricket", label: "Cricket", enabled: true },
  { key: "football", label: "Football", enabled: false },
  { key: "basketball", label: "Basketball", enabled: false },
  { key: "badminton", label: "Badminton", enabled: false },
  { key: "table-tennis", label: "Table Tennis", enabled: false },
  { key: "tennis", label: "Tennis", enabled: false },
  { key: "golf", label: "Golf", enabled: false },
  { key: "volleyball", label: "Volleyball", enabled: false },
];

export const mockPlayerCategories: PlayerCategory[] = [
  { key: "batsman", label: "Batsman", sport: "cricket" },
  { key: "bowler", label: "Bowler", sport: "cricket" },
  { key: "all-rounder", label: "All Rounder", sport: "cricket" },
  { key: "wicket-keeper", label: "Wicket Keeper", sport: "cricket" },
];

export const mockVideos: PlayerVideo[] = [
  {
    id: "v1",
    thumbnailUrl: "https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=640",
    title: "Century highlights vs Chittagong XI",
    playerName: "Rahim Khan",
    durationSec: 184,
    views: 12400,
    sport: "cricket",
  },
  {
    id: "v2",
    thumbnailUrl: "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=640",
    title: "Bowling spell — 5 wickets",
    playerName: "Arif Hossain",
    durationSec: 212,
    views: 9800,
    sport: "cricket",
  },
  {
    id: "v3",
    thumbnailUrl: "https://images.unsplash.com/photo-1624526267942-ab0ff8a35d10?w=640",
    title: "Fielding compilation",
    playerName: "Sohan Ali",
    durationSec: 148,
    views: 5600,
    sport: "cricket",
  },
  {
    id: "v4",
    thumbnailUrl: "https://images.unsplash.com/photo-1607627000458-210e8d2bdb1d?w=640",
    title: "Fastest fifty of the season",
    playerName: "Mahmud Karim",
    durationSec: 168,
    views: 21300,
    sport: "cricket",
  },
];

const roles = ["Batsman", "Bowler", "All Rounder", "Wicket Keeper"] as const;
const categoryKeys = ["batsman", "bowler", "all-rounder", "wicket-keeper"] as const;
const names = [
  "Tamim Iqbal", "Shakib Rahman", "Mushfiqur Kabir", "Mahmudullah Riyad",
  "Litton Das", "Mustafizur Rahman", "Taskin Ahmed", "Mehidy Hasan",
  "Soumya Sarkar", "Nurul Hasan", "Afif Hossain", "Nasum Ahmed",
  "Yasir Ali", "Naim Sheikh", "Shoriful Islam", "Ebadot Hossain",
  "Mahedi Hasan", "Rubel Miah", "Rony Talukdar", "Anamul Haque",
  "Enamul Bijoy", "Saif Hassan", "Parvez Emon", "Towhid Hridoy",
];
const countries: Array<{ name: string; code: string }> = [
  { name: "Bangladesh", code: "BD" },
  { name: "India", code: "IN" },
  { name: "Pakistan", code: "PK" },
  { name: "Sri Lanka", code: "LK" },
  { name: "England", code: "GB" },
  { name: "Australia", code: "AU" },
];
const images = [
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400",
  "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
  "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=400",
  "https://images.unsplash.com/photo-1529946179074-87642f6204d7?w=400",
  "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400",
  "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=400",
  "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400",
];

export const mockPlayers: PlayerCardT[] = names.map((name, i) => {
  const roleIdx = i % roles.length;
  const country = countries[i % countries.length];
  const created = new Date(2024, i % 12, ((i * 7) % 27) + 1).toISOString();
  return {
    id: `p_${i + 1}`,
    name,
    playingRole: roles[roleIdx],
    categoryKey: categoryKeys[roleIdx],
    sport: "cricket",
    imageUrl: images[i % images.length],
    country: country.name,
    countryCode: country.code,
    experienceYears: 1 + ((i * 3) % 18),
    rating: Number((3 + ((i * 0.37) % 2)).toFixed(1)),
    createdAt: created,
    academy: i % 3 === 0 ? "Bengal Tigers Cricket Academy" : undefined,
  };
});
