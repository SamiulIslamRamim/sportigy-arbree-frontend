import { ComingSoonPage } from "#/features/player/components/ComingSoonPage";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/player/reviews")({
  ssr: false,
  head: () => ({ meta: [{ title: "Reviews — Spotig" }] }),
  component: () => <ComingSoonPage title="Reviews" />,
});
