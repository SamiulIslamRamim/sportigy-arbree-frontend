import { z } from "zod";

export const editProfileSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(100),
  bio: z.string().trim().max(500, "Bio is too long").optional().nullable(),
  gender: z.enum(["male", "female", "other"]).optional().nullable(),
  birthday: z.string().min(1, "Birthday is required"),
  height: z.string().trim().max(20).optional().nullable(),
  weight: z.string().trim().max(20).optional().nullable(),
  contactNo: z.string().trim().max(20).optional().nullable(),
  city: z.string().trim().max(100).optional().nullable(),
  state: z.string().trim().max(100).optional().nullable(),
  country: z.string().trim().min(2, "Country is required").max(100),
  academy: z.string().trim().max(100).optional().nullable(),
});

export type EditProfileFormValues = z.infer<typeof editProfileSchema>;