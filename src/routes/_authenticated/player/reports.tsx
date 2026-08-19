import { ComingSoonPage } from "#/features/player/components/ComingSoonPage";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/player/reports")({
  ssr: false,
  head: () => ({ meta: [{ title: "Reports — Spotig" }] }),
  component: () => <ComingSoonPage title="Reports" />,
});
