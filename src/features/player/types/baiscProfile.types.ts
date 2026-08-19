export interface BasicProfile {
  id: string;
  name: string;
  bio: string | null;
  gender: "male" | "female" | "other" | null;
  birthday: string | null;   // ISO date
  height: string | null;
  weight: string | null;
  contactNo: string | null;
  city: string | null;
  state: string | null;
  country: string;
  websiteUrl: string | null; // read-only via PATCH (backend drops it)
}

export interface UpdateBasicProfileInput {
  name?: string;
  bio?: string;
  gender?: "male" | "female" | "other";
  birthday?: string;
  height?: string;
  weight?: string;
  contactNo?: string;
  city?: string;
  state?: string;
  country?: string;
  // NOTE: websiteUrl is NOT accepted by the backend PATCH schema — silently dropped.
  // Treat websiteUrl as read-only until backend adds it (gap #6).
}
