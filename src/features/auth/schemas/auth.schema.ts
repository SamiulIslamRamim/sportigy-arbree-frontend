import { getCountryCode, validatePhoneNumber } from '#/features/player/utils/country'
import { z } from 'zod'

const strongPassword = z
  .string()
  .min(8, 'At least 8 characters')
  .regex(/[A-Z]/, 'Needs an uppercase letter')
  .regex(/[a-z]/, 'Needs a lowercase letter')
  .regex(/[0-9]/, 'Needs a number')

export const loginSchema = z.object({
  identifier: z.string().trim().min(1, 'Email or username is required'),
  password: z.string().min(1, 'Password is required'),
  remember: z.boolean().optional(),
})
export type LoginValues = z.infer<typeof loginSchema>

export const forgotPasswordSchema = z.object({
  email: z.string().trim().email('Invalid email'),
})
export type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>

export const otpSchema = z.object({
  email: z.string().email(),
  otp: z.string().length(6, 'Enter the 6-digit code'),
})
export type OtpValues = z.infer<typeof otpSchema>

export const resetPasswordSchema = z
  .object({
    email: z.string().email(),
    otp: z.string().length(6, 'Enter the 6-digit code'),
    password: strongPassword,
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match',
  })
export type ResetPasswordValues = z.infer<typeof resetPasswordSchema>

/* ---------- Player Registration ---------- */
export const playerSection1 = z.object({
  name: z.string().trim().min(2, 'Full name is required').max(100),
  country: z.string().trim().min(2, 'Full name is required').max(100),
  email: z.string().trim().email('Invalid email'),
  birthday: z.string().min(1, 'Date of birth is required'),
  contactNo: z.string().trim().min(6, 'Phone is required').max(20),
  username: z
    .string()
    .trim()
    .min(3, 'Min 3 characters')
    .max(30)
    .regex(/^[a-zA-Z0-9_]+$/, 'Letters, numbers, underscore only'),
}).superRefine((data, ctx) => {
    const code = getCountryCode(data.country);

    if (!code) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Select a valid country",
        path: ["country"],
      });
      return;
    }

    if (!validatePhoneNumber(code, data.contactNo)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Invalid phone number for selected country",
        path: ["contactNo"],
      });
    }
  });

export const playerSection2 = z.object({
  height: z.string().trim().min(1, 'Height is required'),
  weight: z.string().trim().min(1, 'Weight is required'),
  categories: z.array(z.string()).min(1, 'Select at least one category'),
  websiteUrl: z
    .string()
    .trim()
    .url('Invalid URL')
    .optional()
    .or(z.literal('').transform(() => undefined)),
})

export const playerSection3 = z
  .object({
    password: strongPassword,
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match',
  })

export const playerSchema = playerSection1
  .safeExtend(playerSection2.shape)
  .and(playerSection3)
export type PlayerValues = z.infer<typeof playerSchema>

/* ---------- Organization Registration ---------- */
export const orgSection1 = z.object({
  name: z.string().trim().min(2, 'Organization name is required').max(120),
  email: z.string().trim().email('Invalid email'),
  contactNo: z.string().trim().min(6, 'Phone is required').max(20),
  username: z
    .string()
    .trim()
    .min(3)
    .max(30)
    .regex(/^[a-zA-Z0-9_]+$/, 'Letters, numbers, underscore only'),
  categories: z.array(z.string()).min(1, 'Select an organization type'),
  websiteUrl: z
    .string()
    .trim()
    .url('Invalid URL')
    .optional()
    .or(z.literal('').transform(() => undefined)),
})

export const orgSection2 = z.object({
  city: z.string().trim().min(1, 'City is required'),
  state: z.string().trim().min(1, 'State is required'),
  country: z.string().trim().min(1, 'Country is required'),
})

export const orgSection3 = z
  .object({
    password: strongPassword,
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match',
  })

export const orgSchema = orgSection1.merge(orgSection2).and(orgSection3)
export type OrgValues = z.infer<typeof orgSchema>
