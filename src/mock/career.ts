import type { CareerStatistics } from "#/features/player/types";


export const mockCareer: CareerStatistics = {
  batting: [
    { format: "TEST", matches: 24, innings: 40, runs: 1820, highestScore: 154, average: 45.5, strikeRate: 58.2, fifties: 10, hundreds: 4, fours: 210, sixes: 12, notOuts: 4 },
    { format: "ODI", matches: 88, innings: 82, runs: 3140, highestScore: 138, average: 41.8, strikeRate: 87.4, fifties: 18, hundreds: 7, fours: 302, sixes: 45, notOuts: 7 },
    { format: "T20I", matches: 54, innings: 52, runs: 1420, highestScore: 92, average: 32.3, strikeRate: 138.6, fifties: 9, hundreds: 0, fours: 140, sixes: 62, notOuts: 8 },
    { format: "LIST_A", matches: 122, innings: 118, runs: 4210, highestScore: 168, average: 43.9, strikeRate: 89.1, fifties: 24, hundreds: 9, fours: 410, sixes: 71, notOuts: 12 },
    { format: "FIRST_CLASS", matches: 68, innings: 116, runs: 5240, highestScore: 212, average: 48.9, strikeRate: 61.2, fifties: 28, hundreds: 12, fours: 610, sixes: 32, notOuts: 9 },
    { format: "T20", matches: 140, innings: 138, runs: 3980, highestScore: 108, average: 30.4, strikeRate: 142.8, fifties: 22, hundreds: 2, fours: 380, sixes: 168, notOuts: 15 },
  ],
  bowling: [
    { format: "TEST", matches: 24, overs: 120.4, maidens: 18, wickets: 32, economy: 3.1, average: 28.5, bestBowling: "5/42", strikeRate: 55.2 },
    { format: "ODI", matches: 88, overs: 210.2, maidens: 12, wickets: 58, economy: 4.6, average: 32.1, bestBowling: "4/28", strikeRate: 41.8 },
    { format: "T20I", matches: 54, overs: 88.4, maidens: 2, wickets: 41, economy: 7.2, average: 22.4, bestBowling: "4/19", strikeRate: 18.6 },
    { format: "LIST_A", matches: 122, overs: 320.1, maidens: 18, wickets: 96, economy: 4.8, average: 30.2, bestBowling: "5/34", strikeRate: 39.4 },
    { format: "FIRST_CLASS", matches: 68, overs: 410.5, maidens: 62, wickets: 112, economy: 2.9, average: 24.8, bestBowling: "6/38", strikeRate: 52.6 },
    { format: "T20", matches: 140, overs: 180.2, maidens: 4, wickets: 88, economy: 7.6, average: 24.1, bestBowling: "4/16", strikeRate: 19.4 },
  ],
  
};
