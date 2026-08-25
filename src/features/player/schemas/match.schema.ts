import { z } from 'zod'
import { MATCH_RESULTS } from '../types/match.types'

export const matchBaseSchema = z.object({
  sportId: z.string().min(1, 'Select a sport'),
  sportCategoryId: z.string().optional(),
  title: z.string().max(120).optional(),
  tournament: z.string().max(120).optional(),
  matchType: z.string().max(60).optional(),
  venue: z.string().max(160).optional(),
  homeTeam: z.string().max(120).optional(),
  awayTeam: z.string().max(120).optional(),
  playerSide: z.enum(['HOME', 'AWAY']).optional(),
  matchDate: z.string().min(1, 'Match date is required'),
  result: z.enum(MATCH_RESULTS as [string, ...string[]], {
    message: 'Select a result',
  }),
  isCaptain: z.boolean().optional(),
  isSubstitute: z.boolean().optional(),
  minutesPlayed: z.string().optional(),
  notes: z.string().max(500).optional(),
})

export type MatchBaseFormValues = z.infer<typeof matchBaseSchema>
