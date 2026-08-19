import { MatchReviewQueue } from "#/features/admin/components/MatchReviewQueue";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/_authed/matches")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Match review — Admin Spotig" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: MatchReviewQueue,
});
