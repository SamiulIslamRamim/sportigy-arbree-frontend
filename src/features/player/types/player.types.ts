export const CRICKET_PLAYING_ROLES = [
  "WICKET_KEEPER",
  "BATSMAN",
  "BOWLER",
  "ALL_ROUNDER",
] as const;
export type CricketPlayingRole = (typeof CRICKET_PLAYING_ROLES)[number];

export const BATTING_STYLES = ["RIGHT_HAND_BAT", "LEFT_HAND_BAT"] as const;
export type BattingStyle = (typeof BATTING_STYLES)[number];

export const BOWLING_STYLES = [
  "RIGHT_ARM_FAST",
  "LEFT_ARM_FAST",
  "LEFT_ARM_SPIN",
  "RIGHT_ARM_SPIN",
  "NONE",
] as const;
export type BowlingStyle = (typeof BOWLING_STYLES)[number];

export interface PlayerInformation {
  name: string | null;
  academy: string | null;
  weight: string | null;
  height: string | null;
  birthday: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  playingRole: CricketPlayingRole | null;
  battingStyle: BattingStyle | null;
  bowlingStyle: BowlingStyle | null;
}

export interface UpdatePlayerInformationInput {
  name: string;
  academy: string;
  weight: string;
  height: string;
  playingRole: CricketPlayingRole;
  battingStyle: BattingStyle;
  bowlingStyle: BowlingStyle;
  birthday: string;
  city: string;
  state: string;
  country: string;
}

export const PLAYING_ROLE_LABELS: Record<CricketPlayingRole, string> = {
  WICKET_KEEPER: "Wicket Keeper",
  BATSMAN: "Batsman",
  BOWLER: "Bowler",
  ALL_ROUNDER: "All Rounder",
};

export const BATTING_STYLE_LABELS: Record<BattingStyle, string> = {
  RIGHT_HAND_BAT: "Right-hand bat",
  LEFT_HAND_BAT: "Left-hand bat",
};

export const BOWLING_STYLE_LABELS: Record<BowlingStyle, string> = {
  RIGHT_ARM_FAST: "Right-arm fast",
  LEFT_ARM_FAST: "Left-arm fast",
  LEFT_ARM_SPIN: "Left-arm spin",
  RIGHT_ARM_SPIN: "Right-arm spin",
  NONE: "None",
};
