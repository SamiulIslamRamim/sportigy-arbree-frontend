export type SportKey = "cricket" | "football" | "basketball";

export type CricketFormat = "TEST" | "ODI" | "T20I" | "LIST_A" | "FIRST_CLASS" | "T20";

export type MatchResult = "WIN" | "LOSS" | "DRAW" | "NO_RESULT";

export interface PlayerProfile {
  id: string;
  fullName: string;
  avatarUrl: string;
  playingRole: string;
  battingStyle: string;
  bowlingStyle: string;
  countryCode: string;
  countryName: string;
  countryFlagUrl: string;
  teamName: string;
  teamLogoUrl: string;
  heightCm: number;
  weightKg: number;
  academy: string;
  age: number;
  birthDate: string;
  address: string;
}

export interface BattingStatistics {
  format: CricketFormat;
  matches: number;
  innings: number;
  runs: number;
  highestScore: number;
  average: number;
  strikeRate: number;
  fifties: number;
  hundreds: number;
  fours: number;
  sixes: number;
  notOuts: number;
}

export interface BowlingStatistics {
  format: CricketFormat;
  matches: number;
  overs: number;
  maidens: number;
  wickets: number;
  economy: number;
  average: number;
  bestBowling: string;
  strikeRate: number;
}

export interface CareerStatistics {
  batting: BattingStatistics[];
  bowling: BowlingStatistics[];
}

export interface RecentMatch {
  id: string;
  opponent: string;
  opponentLogoUrl: string;
  runs: number;
  balls: number;
  fours: number;
  sixes: number;
  strikeRate: number;
  result: MatchResult;
  ground: string;
  date: string;
  matchType: CricketFormat;
}

export interface UpcomingMatch {
  id: string;
  opponent: string;
  opponentLogoUrl: string;
  homeTeam: string;
  homeTeamLogoUrl: string;
  date: string;
  venue: string;
  matchType: CricketFormat;
}

export interface LatestResult {
  id: string;
  homeTeam: string;
  homeTeamLogoUrl: string;
  homeScore: string;
  awayTeam: string;
  awayTeamLogoUrl: string;
  awayScore: string;
  result: MatchResult;
  date: string;
}

export interface Team {
  id: string;
  name: string;
  logoUrl: string;
  role: string;
}

export interface EarningsSummary {
  thisMonth: number;
  lastThreeMonths: number;
  thisYear: number;
  currency: string;
}

export interface MatchOverview {
  thisMonth: number;
  lastThreeMonths: number;
  thisYear: number;
}

export interface Notification {
  id: string;
  title: string;
  body: string;
  createdAt: string;
  read: boolean;
}

export interface TransactionSummary {
  id: string;
  amount: number;
  currency: string;
  description: string;
  date: string;
  type: "CREDIT" | "DEBIT";
}

export interface DashboardResponse {
  profile: PlayerProfile;
  earnings: EarningsSummary;
  matchOverview: MatchOverview;
  recentMatches: RecentMatch[];
  career: CareerStatistics;
  latestResults: LatestResult[];
  upcomingMatch: UpcomingMatch;
  teams: Team[];
  notifications: Notification[];
  sport: SportKey;
}
