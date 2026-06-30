export type UserRole = "player" | "organization";

export interface AuthUser {
  id: string;
  email: string;
  username: string;
  role: UserRole;
  name?: string | null;
}

export interface TokenPair {
  access: string;
  refresh: string;
}

export interface LoginPayload {
  identifier: string; // email or username
  password: string;
}

export interface LoginResponse {
  access: string;
  refresh: string;
  user?: AuthUser;
}

export interface PlayerRegistrationPayload {
  name: string;
  email: string;
  birthday: string; // ISO date
  contactNo: string;
  username: string;
  height: string;
  weight: string;
  categories: string[];
  websiteUrl?: string;
  password: string;
}

export interface OrganizationRegistrationPayload {
  name: string;
  email: string;
  contactNo: string;
  username: string;
  categories: string[];
  websiteUrl?: string;
  city: string;
  state: string;
  country: string;
  password: string;
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface ResetPasswordPayload {
  email: string;
  otp: string;
  password: string;
}

export interface VerifyOtpPayload {
  email: string;
  otp: string;
}
