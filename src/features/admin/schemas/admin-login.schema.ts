import z from "zod";

export const adminLoginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
  remember: z.boolean().optional(),
});

export type AdminLoginValues = z.infer<typeof adminLoginSchema>;