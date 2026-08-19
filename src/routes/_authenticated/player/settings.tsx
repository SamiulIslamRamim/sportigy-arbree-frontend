import { ComingSoonPage } from "#/features/player/components/ComingSoonPage";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/player/settings")({
  ssr: false,
  head: () => ({ meta: [{ title: "Settings — Spotig" }] }),
  component: () => <ComingSoonPage title="Settings" />,
});
