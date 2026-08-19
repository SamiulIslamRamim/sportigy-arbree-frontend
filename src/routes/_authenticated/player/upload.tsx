import { ComingSoonPage } from "#/features/player/components/ComingSoonPage";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/player/upload")({
  ssr: false,
  head: () => ({ meta: [{ title: "Upload — Spotig" }] }),
  component: () => <ComingSoonPage title="Upload" />,
});
