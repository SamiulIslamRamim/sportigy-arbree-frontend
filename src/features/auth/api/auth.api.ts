import { api, unwrap } from "@/lib/api/axios";
import type { ApiEnvelope } from "@/lib/api/axios";
import type {
  AuthUser,
  ForgotPasswordPayload,
  LoginPayload,
  LoginResponse,
  OrganizationRegistrationPayload,
  PlayerRegistrationPayload,
  ResetPasswordPayload,
  VerifyOtpPayload,
} from "../types/auth.types";

export const authApi = {
  login: async (payload: LoginPayload): Promise<LoginResponse> => {
    const res = await api.post<ApiEnvelope<LoginResponse>>("/token/", {
      username: payload.identifier,
      email: payload.identifier,
      password: payload.password,
    });
    return unwrap(res);
  },
  refreshToken: async (): Promise<{ accessToken: string }> => {
    const res = await api.post<ApiEnvelope<{ accessToken: string }>>('/token/refresh/', {});
    return unwrap(res);
  },
  verifySession: async (): Promise<{ accessToken: string; user: AuthUser }> => {
    const res = await api.get<ApiEnvelope<{ accessToken: string; user: AuthUser }>>('/token/verify/');
    return unwrap(res);
  },
  logout: async (): Promise<void> => {
    await api.post('/logout/');
  },
  registerPlayer: async (payload: PlayerRegistrationPayload) => {
    const res = await api.post<ApiEnvelope<{ email: string }>>("/players/", payload);
    return unwrap(res);
  },
  registerOrganization: async (payload: OrganizationRegistrationPayload) => {
    const res = await api.post<ApiEnvelope<{ email: string }>>("/organizations/", payload);
    return unwrap(res);
  },
  verifyOtp: async (payload: VerifyOtpPayload) => {
    const res = await api.post<ApiEnvelope<{ id: string; email: string; role: string }>>("/verify-registration/", payload);
    return unwrap(res);
  },
  forgotPassword: async (payload: ForgotPasswordPayload) => {
    const res = await api.post<ApiEnvelope<Record<string, never>>>("/forgot-password/", payload);
    return unwrap(res);
  },
  resetPassword: async (payload: ResetPasswordPayload) => {
    const res = await api.post<ApiEnvelope<Record<string, never>>>("/reset-password/", payload);
    return unwrap(res);
  },
};
