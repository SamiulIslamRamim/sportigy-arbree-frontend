import { MatchReviewDetail } from "#/features/admin/components/MatchReviewDetail";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/_authed/matches/$matchId")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Match detail — Admin Spotig" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: MatchDetailPage,
});

function MatchDetailPage() {
  const { matchId } = Route.useParams();
  return <MatchReviewDetail matchId={matchId} />;
}
