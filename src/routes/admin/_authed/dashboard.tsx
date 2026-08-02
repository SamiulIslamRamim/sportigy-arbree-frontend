import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute("/admin/_authed/dashboard")({
  head: () => ({
    meta: [
      { title: "Admin Dashboard — Spotig" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminDashboardPage,
});

function AdminDashboardPage() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
        Hello Admin
      </h1>
    </div>
  );
}