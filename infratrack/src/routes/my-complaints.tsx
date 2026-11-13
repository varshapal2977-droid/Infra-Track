import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { RequireAuth } from "@/components/RequireAuth";
import { AppShell } from "@/components/AppShell";
import { StatusBadge, PriorityBadge } from "@/components/Badges";
import { useAuth } from "@/hooks/useAuth";
import { fetchComplaints } from "@/lib/complaints";
import { CATEGORIES, STATUSES, categoryLabel, formatDate } from "@/lib/infratrack";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/my-complaints")({
  head: () => ({
    meta: [
      { title: "My complaints — InfraTrack" },
      { name: "description", content: "All the civic issues you have reported and their status." },
      { property: "og:title", content: "My complaints — InfraTrack" },
      { property: "og:description", content: "Search and filter the issues you reported." },
    ],
  }),
  component: () => (
    <RequireAuth>
      <AppShell title="My Complaints">
        <MyComplaints />
      </AppShell>
    </RequireAuth>
  ),
});

function MyComplaints() {
  const { user } = useAuth();
  const { data = [], isLoading } = useQuery({
    queryKey: ["complaints", "mine", user?.id],
    queryFn: () => fetchComplaints({ userId: user!.id }),
    enabled: !!user,
  });
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("all");
  const [category, setCategory] = useState("all");

  const rows = useMemo(
    () =>
      data.filter(
        (c) =>
          (status === "all" || c.status === status) &&
          (category === "all" || c.category === category) &&
          (q === "" ||
            `${c.title} ${c.description} ${c.address} ${c.complaint_id}`
              .toLowerCase()
              .includes(q.toLowerCase())),
      ),
    [data, q, status, category],
  );

  const selectClass =
    "h-10 rounded-md border bg-background px-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-ring";

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2 rounded-xl border bg-card p-3 shadow-card">
        <Input
          className="max-w-xs"
          placeholder="Search title, ID or address"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <select className={selectClass} value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="all">All statuses</option>
          {STATUSES.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
        <select className={selectClass} value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="all">All categories</option>
          {CATEGORIES.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>
      </div>

      <div className="overflow-x-auto rounded-xl border bg-card shadow-card">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-left text-xs tracking-wide text-muted-foreground uppercase">
            <tr>
              <th className="px-4 py-3">ID</th>
              <th className="px-4 py-3">Issue</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Priority</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Reported</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {isLoading ? (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-muted-foreground">
                  Loading…
                </td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-muted-foreground">
                  No complaints found.
                </td>
              </tr>
            ) : (
              rows.map((c) => (
                <tr key={c.id} className="hover:bg-muted/40">
                  <td className="px-4 py-3 font-mono text-xs">{c.complaint_id}</td>
                  <td className="px-4 py-3">
                    <Link
                      to="/complaints/$id"
                      params={{ id: c.id }}
                      className="font-medium hover:text-primary"
                    >
                      {c.title}
                    </Link>
                    <p className="text-xs text-muted-foreground">{c.address}</p>
                  </td>
                  <td className="px-4 py-3">{categoryLabel(c.category)}</td>
                  <td className="px-4 py-3">
                    <PriorityBadge priority={c.priority} />
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={c.status} />
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">{formatDate(c.created_at)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
