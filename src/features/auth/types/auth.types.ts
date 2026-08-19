export type UserRole = "player" | "organization";

export interface AuthUser {
  id: string;
  email: string;
  username: string;
  role: UserRole; 
  name: string;
  bio?: string | null;
  gender?: "male" | "female" | "other" | null;
  birthday?: string | null;      
  height?: string | null;
  weight?: string | null;
  contactNo?: string | null;
  city?: string | null;
  state?: string | null;
  country: string;
  websiteUrl?: string | null;
  isActive: boolean;
  categories?: string[] | null;  
}


// export interface TokenPair {
//   access: string;
//   refresh: string;
// }

export interface LoginPayload {
  identifier: string; // email or username
  password: string;
}

export interface LoginResponse {
  access: string;
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
  website_url?: string;
  password: string;
  country: string;
}

export interface OrganizationRegistrationPayload {
  name: string;
  email: string;
  contactNo: string;
  username: string;
  categories: string[];
  website_url?: string;
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
  newPassword: string;
}

export interface VerifyOtpPayload {
  email: string;
  otp: string;
}
