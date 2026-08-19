import { z } from "zod";
import type { SportFieldWithOptions } from "../types/match.types";

export const matchHeaderSchema = z.object({
  matchDate: z.string().min(1, "Match date is required"),
  result: z.enum(["WIN", "LOSS", "DRAW", "TIE", "NO_RESULT"]),
  playerSide: z.enum(["HOME", "AWAY"]).optional(),
  venue: z.string().optional(),
  homeTeam: z.string().optional(),
  homeTeamOrgId: z.string().optional(),
  awayTeam: z.string().optional(),
  awayTeamOrgId: z.string().optional(),
  isCaptain: z.boolean().optional(),
  isSubstitute: z.boolean().optional(),
  notes: z.string().optional(),
});

export function buildMatchFormSchema(fields: SportFieldWithOptions[]) {
  const shape: Record<string, z.ZodTypeAny> = {};
  for (const field of fields) {
    let schema: z.ZodTypeAny = z.unknown().optional();
    switch (field.type) {
      case "NUMBER":
        schema = z.coerce.number().min(-100000).max(100000);
        break;
      case "TEXT":
        schema = z.string().max(500);
        break;
      case "BOOLEAN":
        schema = z.boolean();
        break;
      case "DATE":
        schema = z.string();
        break;
      case "SELECT":
      case "MULTI_SELECT":
        schema = z.string();
        break;
    }
    shape[field.id] = field.required ? schema : schema.optional().or(z.literal("")).optional();
  }
  return matchHeaderSchema.extend({ values: z.object(shape).optional() });
}

export type MatchFormValues = z.infer<typeof matchHeaderSchema> & {
  values?: Record<string, unknown>;
};
