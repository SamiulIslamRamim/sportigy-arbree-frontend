import { SportsManagement } from "#/features/admin/components/SportsManagement";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/_authed/sports")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Sports — Admin Spotig" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: SportsManagement,
});
