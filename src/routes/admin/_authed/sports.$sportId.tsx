import { SportDetail } from "#/features/admin/components/SportDetail";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/_authed/sports/$sportId")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Sport detail — Admin Spotig" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: SportDetailPage,
});

function SportDetailPage() {
  const { sportId } = Route.useParams();
  return <SportDetail sportId={sportId} />;
}
