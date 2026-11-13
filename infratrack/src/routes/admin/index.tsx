import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { AlertTriangle, CheckCircle2, Clock, FileText } from "lucide-react";
import { RequireAuth } from "@/components/RequireAuth";
import { AppShell } from "@/components/AppShell";
import { StatCard } from "@/components/StatCard";
import { StatusBadge, PriorityBadge } from "@/components/Badges";
import { MapPanel } from "@/components/MapPanel";
import { fetchComplaints } from "@/lib/complaints";
import { categoryLabel, formatDate } from "@/lib/infratrack";

export const Route = createFileRoute("/admin/")({
  head: () => ({
    meta: [
      { title: "Authority dashboard — InfraTrack" },
      { name: "description", content: "City-wide overview of civic complaints and their status." },
      { property: "og:title", content: "Authority dashboard — InfraTrack" },
      { property: "og:description", content: "Monitor and resolve reported infrastructure issues." },
    ],
  }),
  component: () => (
    <RequireAuth admin>
      <AppShell title="Admin Dashboard">
        <AdminDashboard />
      </AppShell>
    </RequireAuth>
  ),
});

function AdminDashboard() {
  const { data = [], isLoading } = useQuery({
    queryKey: ["complaints", "all"],
    queryFn: () => fetchComplaints(),
  });

  const count = (s: string) => data.filter((c) => c.status === s).length;
  const highOpen = data.filter((c) => c.priority === "high" && c.status !== "resolved");
  const latest = data.slice(0, 8);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total complaints" value={data.length} icon={FileText} />
        <StatCard label="Pending" value={count("pending")} icon={Clock} tone="accent" />
        <StatCard
          label="High priority open"
          value={highOpen.length}
          icon={AlertTriangle}
          tone="destructive"
        />
        <StatCard label="Resolved" value={count("resolved")} icon={CheckCircle2} tone="success" />
      </div>

      <div className="rounded-xl border bg-card shadow-card">
        <div className="flex items-center justify-between border-b px-5 py-4">
          <h3 className="font-medium">Latest complaints</h3>
          <Link to="/admin/complaints" className="text-sm text-primary hover:underline">
            Manage all
          </Link>
        </div>
        {isLoading ? (
          <p className="p-5 text-sm text-muted-foreground">Loading…</p>
        ) : (
          <ul className="divide-y">
            {latest.map((c) => (
              <li key={c.id} className="flex flex-wrap items-center gap-3 px-5 py-3">
                <div className="min-w-0 flex-1">
                  <Link
                    to="/complaints/$id"
                    params={{ id: c.id }}
                    className="font-medium hover:text-primary"
                  >
                    {c.title}
                  </Link>
                  <p className="text-xs text-muted-foreground">
                    {c.complaint_id} · {categoryLabel(c.category)} · {c.area ?? c.address} ·{" "}
                    {formatDate(c.created_at)}
                  </p>
                </div>
                <PriorityBadge priority={c.priority} />
                <StatusBadge status={c.status} />
              </li>
            ))}
          </ul>
        )}
      </div>

      <div>
        <h3 className="mb-3 font-medium">City map</h3>
        <MapPanel complaints={data} height="460px" />
      </div>
    </div>
  );
}
