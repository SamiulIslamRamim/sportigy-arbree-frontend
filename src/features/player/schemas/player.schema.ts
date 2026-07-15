import { z } from "zod";
import {
  BATTING_STYLES,
  BOWLING_STYLES,
  CRICKET_PLAYING_ROLES,
} from "../types/player.types";

const trimmedString = (label: string) =>
  z
    .string()
    .trim()
    .min(1, `${label} is required`);

export const updatePlayerInformationSchema = z.object({
  name: trimmedString("Name"),
  academy: trimmedString("Academy"),
  weight: trimmedString("Weight"),
  height: trimmedString("Height"),
  playingRole: z.enum(CRICKET_PLAYING_ROLES),
  battingStyle: z.enum(BATTING_STYLES),
  bowlingStyle: z.enum(BOWLING_STYLES),
  birthday: trimmedString("Birthday"),
  city: trimmedString("City"),
  state: trimmedString("State"),
  country: trimmedString("Country"),
});

export type UpdatePlayerInformationFormValues = z.infer<
  typeof updatePlayerInformationSchema
>;


