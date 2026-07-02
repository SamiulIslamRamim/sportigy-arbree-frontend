import type { Notification } from "#/features/player/types";

export const mockNotifications: Notification[] = [
  { id: "n_001", title: "New match scheduled", body: "You have a T20I match on Dec 24", createdAt: "2024-11-28T09:00:00Z", read: false },
  { id: "n_002", title: "Sponsorship payout", body: "BDT 5,500 credited to your wallet", createdAt: "2024-11-14T10:20:00Z", read: true },
];
