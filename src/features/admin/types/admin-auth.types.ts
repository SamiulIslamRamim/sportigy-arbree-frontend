export interface AdminUser {
  username: string;
  role: string;
}

export interface AdminLoginPayload {
  username: string;
  password: string;
}

export interface AdminLoginResponse {
  accessToken: string;
  admin: AdminUser;
}

export interface AdminRefreshResponse {
  accessToken: string;
}

export interface AdminVerifyResponse {
  accessToken: string;
  admin: AdminUser;
}
