import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowRight,
  ChevronRight,
  FilePlus2,
  Filter,
  Loader2,
  MapPin,
  PlusCircle,
  RotateCcw,
  Search,
  X,
} from "lucide-react";
import { RequireAuth } from "@/components/RequireAuth";
import { AppShell } from "@/components/AppShell";
import { StatusBadge, PriorityBadge } from "@/components/Badges";
import { useAuth } from "@/hooks/useAuth";
import { fetchComplaints } from "@/lib/complaints";
import { CATEGORIES, STATUSES, categoryLabel, formatDate } from "@/lib/infratrack";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/my-complaints")({
  head: () => ({
    meta: [
      { title: "My Reported Issues — InfraTrack" },
      { name: "description", content: "All civic issues you have reported with real-time status and audit milestones." },
      { property: "og:title", content: "My Reported Issues — InfraTrack" },
      { property: "og:description", content: "Search and filter the civic issues you reported." },
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

  const isFiltered = q !== "" || status !== "all" || category !== "all";

  function resetFilters() {
    setQ("");
    setStatus("all");
    setCategory("all");
  }

  const selectClass =
    "h-10 rounded-xl border border-border/80 bg-background px-3 text-xs font-medium shadow-2xs focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all";

  return (
    <div className="space-y-6">
      {/* Top Controls Toolbar */}
      <div className="flex flex-col gap-3 rounded-2xl border border-border/80 bg-card p-4 shadow-card md:flex-row md:items-center md:justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="pl-9 pr-8 text-sm h-10 rounded-xl"
            placeholder="Search by title, ID or location..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          {q ? (
            <button
              onClick={() => setQ("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          ) : null}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select className={selectClass} value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="all">All Statuses</option>
            {STATUSES.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>

          <select className={selectClass} value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="all">All Categories</option>
            {CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>

          {isFiltered ? (
            <Button variant="ghost" size="sm" onClick={resetFilters} className="text-xs gap-1 text-muted-foreground">
              <RotateCcw className="h-3.5 w-3.5" /> Reset
            </Button>
          ) : null}

          <span className="ml-auto text-xs font-semibold text-muted-foreground">
            {rows.length} {rows.length === 1 ? "Record" : "Records"}
          </span>
        </div>
      </div>

      {/* Main Content Area */}
      {isLoading ? (
        <div className="rounded-2xl border bg-card p-12 text-center text-sm text-muted-foreground shadow-card">
          <Loader2 className="mx-auto h-6 w-6 animate-spin text-primary" />
          <p className="mt-2 font-medium">Loading your grievance records...</p>
        </div>
      ) : rows.length === 0 ? (
        <div className="rounded-2xl border bg-card p-12 text-center space-y-3 shadow-card">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
            <FilePlus2 className="h-6 w-6 text-primary" />
          </div>
          <div className="space-y-1">
            <h3 className="font-display text-base font-bold text-foreground">
              {isFiltered ? "No matching complaints found" : "No complaints reported yet"}
            </h3>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto">
              {isFiltered
                ? "Try clearing your search query or changing filter criteria."
                : "When you report potholes, power failures, or sanitation problems, they will appear here with live tracking."}
            </p>
          </div>
          <div className="pt-2">
            {isFiltered ? (
              <Button size="sm" variant="outline" onClick={resetFilters}>
                Clear Filters
              </Button>
            ) : (
              <Link to="/report">
                <Button size="sm" className="gap-1.5 font-semibold">
                  <PlusCircle className="h-4 w-4" /> Report an Issue Now
                </Button>
              </Link>
            )}
          </div>
        </div>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-hidden rounded-2xl border border-border/80 bg-card shadow-card">
            <table className="w-full text-sm">
              <thead className="bg-muted/40 text-left text-[11px] font-bold tracking-wider text-muted-foreground uppercase border-b border-border/80">
                <tr>
                  <th className="px-5 py-3.5">Complaint ID</th>
                  <th className="px-5 py-3.5">Issue & Address</th>
                  <th className="px-5 py-3.5">Category</th>
                  <th className="px-5 py-3.5">Priority</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5">Date Filed</th>
                  <th className="px-5 py-3.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {rows.map((c) => (
                  <tr key={c.id} className="group hover:bg-muted/30 transition-colors">
                    <td className="px-5 py-4 font-mono text-xs font-bold text-muted-foreground">
                      {c.complaint_id}
                    </td>
                    <td className="px-5 py-4 max-w-xs">
                      <Link
                        to="/complaints/$id"
                        params={{ id: c.id }}
                        className="font-display font-bold text-foreground group-hover:text-primary transition-colors line-clamp-1"
                      >
                        {c.title}
                      </Link>
                      <p className="flex items-center gap-1 text-xs text-muted-foreground truncate mt-0.5">
                        <MapPin className="h-3 w-3 text-primary shrink-0" /> {c.address}
                      </p>
                    </td>
                    <td className="px-5 py-4">
                      <span className="rounded-lg bg-muted px-2 py-0.5 text-xs font-medium text-foreground">
                        {categoryLabel(c.category)}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <PriorityBadge priority={c.priority} />
                    </td>
                    <td className="px-5 py-4">
                      <StatusBadge status={c.status} />
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap text-xs text-muted-foreground">
                      {formatDate(c.created_at)}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <Link to="/complaints/$id" params={{ id: c.id }}>
                        <Button variant="ghost" size="sm" className="gap-1 text-xs">
                          Details <ChevronRight className="h-3.5 w-3.5" />
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card Layout */}
          <div className="grid gap-3.5 md:hidden">
            {rows.map((c) => (
              <div
                key={c.id}
                className="rounded-2xl border border-border/80 bg-card p-4.5 shadow-2xs space-y-3"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-xs font-bold text-muted-foreground">
                    {c.complaint_id}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <PriorityBadge priority={c.priority} />
                    <StatusBadge status={c.status} />
                  </div>
                </div>

                <div>
                  <Link
                    to="/complaints/$id"
                    params={{ id: c.id }}
                    className="font-display text-sm font-bold text-foreground line-clamp-1 hover:text-primary"
                  >
                    {c.title}
                  </Link>
                  <p className="flex items-center gap-1 text-xs text-muted-foreground mt-1 truncate">
                    <MapPin className="h-3 w-3 text-primary shrink-0" /> {c.address}
                  </p>
                </div>

                <div className="flex items-center justify-between border-t border-border/60 pt-3 text-xs">
                  <span className="rounded bg-muted px-1.5 py-0.5 text-[11px] text-muted-foreground">
                    {categoryLabel(c.category)}
                  </span>
                  <Link
                    to="/complaints/$id"
                    params={{ id: c.id }}
                    className="font-semibold text-primary flex items-center gap-1"
                  >
                    Track Progress <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
