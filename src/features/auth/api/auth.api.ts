import { api } from "@/lib/api/axios";
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
    const { data } = await api.post<LoginResponse>("/token/", {
      username: payload.identifier,
      email: payload.identifier,
      password: payload.password,
    });
    return data;
  },
  refreshToken: async (): Promise<{ accessToken: string }> => {
    const { data } = await api.post('/token/refresh/', {});
    return data;
  },
  verifySession: async (): Promise<{ accessToken: string; user: AuthUser }> => {
    const { data } = await api.get('/token/verify/');
    return data;
  },
  logout: async (): Promise<void> => {
    await api.post('/logout/');
  },
  registerPlayer: async (payload: PlayerRegistrationPayload) => {
    const { data } = await api.post("/players/", payload);
    return data;
  },
  registerOrganization: async (payload: OrganizationRegistrationPayload) => {
    const { data } = await api.post("/employee/", payload);
    return data;
  },
  verifyOtp: async (payload: VerifyOtpPayload) => {
    const { data } = await api.post("/verify-registration/", payload);
    return data;
  },
  forgotPassword: async (payload: ForgotPasswordPayload) => {
    const { data } = await api.post("/forgot-password/", payload);
    return data;
  },
  resetPassword: async (payload: ResetPasswordPayload) => {
    const { data } = await api.post("/reset-password/", payload);
    return data;
  },
};
