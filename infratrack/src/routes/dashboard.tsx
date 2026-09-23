import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { CheckCircle2, Clock, FileText, Loader2 } from "lucide-react";
import { RequireAuth } from "@/components/RequireAuth";
import { AppShell } from "@/components/AppShell";
import { StatCard } from "@/components/StatCard";
import { StatusBadge, PriorityBadge } from "@/components/Badges";
import { MapPanel } from "@/components/MapPanel";
import { useAuth } from "@/hooks/useAuth";
import { fetchComplaints } from "@/lib/complaints";
import { categoryLabel, formatDate } from "@/lib/infratrack";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Your dashboard — InfraTrack" },
      { name: "description", content: "Your reported civic issues and their current status." },
      { property: "og:title", content: "Your dashboard — InfraTrack" },
      { property: "og:description", content: "Track the civic issues you reported." },
    ],
  }),
  component: () => (
    <RequireAuth>
      <AppShell title="Dashboard">
        <Dashboard />
      </AppShell>
    </RequireAuth>
  ),
});

function Dashboard() {
  const { user, profile } = useAuth();
  const { data: mine = [], isLoading } = useQuery({
    queryKey: ["complaints", "mine", user?.id],
    queryFn: () => fetchComplaints({ userId: user!.id }),
    enabled: !!user,
  });

  const count = (s: string) => mine.filter((c) => c.status === s).length;
  const recent = mine.slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="rounded-xl border bg-card p-5 shadow-card">
        <h2 className="font-display text-xl font-semibold">
          Welcome, {profile?.full_name || "citizen"}
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Spotted a pothole, a dark street or an overflowing drain? Report it in under a minute.
        </p>
        <Link to="/report">
          <Button className="mt-4">Report an issue</Button>
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total reported" value={mine.length} icon={FileText} />
        <StatCard label="Pending" value={count("pending")} icon={Clock} tone="accent" />
        <StatCard
          label="In progress"
          value={count("assigned") + count("in_progress")}
          icon={Loader2}
          tone="info"
        />
        <StatCard label="Resolved" value={count("resolved")} icon={CheckCircle2} tone="success" />
      </div>

      <div className="rounded-xl border bg-card shadow-card">
        <div className="flex items-center justify-between border-b px-5 py-4">
          <h3 className="font-medium">Recent complaints</h3>
          <Link to="/my-complaints" className="text-sm text-primary hover:underline">
            View all
          </Link>
        </div>
        {isLoading ? (
          <p className="p-5 text-sm text-muted-foreground">Loading…</p>
        ) : recent.length === 0 ? (
          <p className="p-5 text-sm text-muted-foreground">No complaints yet.</p>
        ) : (
          <ul className="divide-y">
            {recent.map((c) => (
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
                    {c.complaint_id} · {categoryLabel(c.category)} · {formatDate(c.created_at)}
                  </p>
                </div>
                <PriorityBadge priority={c.priority} />
                <StatusBadge status={c.status} />
              </li>
            ))}
          </ul>
        )}
      </div>

      {mine.length > 0 ? (
        <div>
          <h3 className="mb-3 font-medium">Your reports on the map</h3>
          <MapPanel complaints={mine} height="420px" />
        </div>
      ) : null}
    </div>
  );
}
