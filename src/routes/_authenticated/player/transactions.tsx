import { ComingSoonPage } from "#/features/player/components/ComingSoonPage";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/player/transactions")({
  ssr: false,
  head: () => ({ meta: [{ title: "Transactions — Spotig" }] }),
  component: () => <ComingSoonPage title="Transactions" />,
});
