import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  AlertTriangle,
  ArrowRight,
  BarChart3,
  Building2,
  CheckCircle2,
  ClipboardList,
  Clock,
  Compass,
  FileText,
  Loader2,
  MapPin,
  ShieldAlert,
  ShieldCheck,
} from "lucide-react";
import { RequireAuth } from "@/components/RequireAuth";
import { AppShell } from "@/components/AppShell";
import { StatCard } from "@/components/StatCard";
import { StatusBadge, PriorityBadge } from "@/components/Badges";
import { MapPanel } from "@/components/MapPanel";
import { fetchComplaints } from "@/lib/complaints";
import { categoryLabel, formatDate } from "@/lib/infratrack";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/admin/")({
  head: () => ({
    meta: [
      { title: "Authority Command Overview — InfraTrack" },
      { name: "description", content: "City-wide overview of civic complaints and their status." },
      { property: "og:title", content: "Authority Dashboard — InfraTrack" },
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
      {/* Officer Command Header */}
      <div className="flex flex-col gap-4 rounded-2xl border border-border/80 bg-gradient-to-r from-card via-card to-primary/5 p-6 shadow-card md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-0.5 text-xs font-semibold text-amber-700 dark:text-amber-400">
            <ShieldCheck className="h-3.5 w-3.5" /> Municipal Authority Command
          </div>
          <h2 className="font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            City Infrastructure Overview
          </h2>
          <p className="text-xs text-muted-foreground">
            Monitoring active grievances, dispatch queues, and field resolution across 18 municipal wards.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Link to="/admin/complaints">
            <Button size="sm" className="gap-1.5 font-semibold shadow-xs">
              <ClipboardList className="h-4 w-4" /> Manage Queue
            </Button>
          </Link>
          <Link to="/admin/analytics">
            <Button size="sm" variant="outline" className="gap-1.5 font-medium">
              <BarChart3 className="h-4 w-4 text-primary" /> City Analytics
            </Button>
          </Link>
        </div>
      </div>

      {/* High Priority Critical Attention Banner */}
      {highOpen.length > 0 ? (
        <div className="flex items-center justify-between gap-3 rounded-2xl border border-destructive/30 bg-destructive/8 p-4 shadow-2xs">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-destructive/15 text-destructive">
              <ShieldAlert className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-destructive">
                {highOpen.length} High-Priority Incident{highOpen.length === 1 ? "" : "s"} Requiring Action
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Immediate safety or major infrastructural disruption reported by citizens.
              </p>
            </div>
          </div>
          <Link to="/admin/complaints">
            <Button size="sm" variant="destructive" className="gap-1 text-xs shrink-0">
              Review High Priority <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>
      ) : null}

      {/* Metric Cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total Registered"
          value={data.length}
          icon={FileText}
          hint="All recorded municipal tickets"
        />
        <StatCard
          label="Pending Triage"
          value={count("pending")}
          icon={Clock}
          tone="accent"
          hint="Awaiting officer assignment"
        />
        <StatCard
          label="High Priority Open"
          value={highOpen.length}
          icon={AlertTriangle}
          tone="destructive"
          hint="Safety critical work orders"
        />
        <StatCard
          label="Resolved Tickets"
          value={count("resolved")}
          icon={CheckCircle2}
          tone="success"
          hint="Inspected & closed"
        />
      </div>

      {/* Latest Complaints List */}
      <div className="rounded-2xl border border-border/80 bg-card shadow-card">
        <div className="flex items-center justify-between border-b border-border/80 px-6 py-4.5">
          <div>
            <h3 className="font-display text-base font-bold text-foreground">Latest Grievances Received</h3>
            <p className="text-xs text-muted-foreground">Most recent incoming citizen reports across wards</p>
          </div>
          <Link
            to="/admin/complaints"
            className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
          >
            Manage entire queue <ArrowRight className="h-3 w-3" />
          </Link>
        </div>

        {isLoading ? (
          <div className="p-8 text-center text-sm text-muted-foreground">
            <Loader2 className="mx-auto h-6 w-6 animate-spin text-primary" />
            <p className="mt-2 font-medium">Loading complaints queue...</p>
          </div>
        ) : (
          <ul className="divide-y divide-border/60">
            {latest.map((c) => (
              <li
                key={c.id}
                className="group flex flex-col gap-3 px-6 py-4 transition-colors hover:bg-muted/30 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0 flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[11px] font-bold text-muted-foreground">
                      {c.complaint_id}
                    </span>
                    <span className="rounded bg-muted px-1.5 py-0.2 text-[10px] font-medium text-foreground">
                      {categoryLabel(c.category)}
                    </span>
                  </div>
                  <Link
                    to="/complaints/$id"
                    params={{ id: c.id }}
                    className="font-display text-sm font-bold text-foreground group-hover:text-primary transition-colors line-clamp-1"
                  >
                    {c.title}
                  </Link>
                  <p className="flex items-center gap-1.5 text-xs text-muted-foreground truncate">
                    <MapPin className="h-3 w-3 text-primary shrink-0" />
                    <span>{c.area ?? c.address}</span>
                    <span>·</span>
                    <span>{formatDate(c.created_at)}</span>
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <PriorityBadge priority={c.priority} />
                  <StatusBadge status={c.status} />
                  <Link to="/complaints/$id" params={{ id: c.id }}>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* City Geospatial Overview */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-display text-base font-bold text-foreground">City-Wide Incident Distribution</h3>
            <p className="text-xs text-muted-foreground">Geospatial spread of all recorded civic issues</p>
          </div>
          <Link to="/map">
            <Button variant="outline" size="sm" className="gap-1.5 text-xs">
              <Compass className="h-3.5 w-3.5 text-primary" /> Full Screen Map
            </Button>
          </Link>
        </div>
        <MapPanel complaints={data} height="460px" />
      </div>
    </div>
  );
}
