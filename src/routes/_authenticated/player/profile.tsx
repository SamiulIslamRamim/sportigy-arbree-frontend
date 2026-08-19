import { ComingSoonPage } from "#/features/player/components/ComingSoonPage";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/player/profile")({
  ssr: false,
  head: () => ({ meta: [{ title: "Profile — Spotig" }] }),
  component: () => <ComingSoonPage title="Profile" />,
});
