import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowLeft,
  Compass,
  Filter,
  Flame,
  Layers,
  MapPin,
  PlusCircle,
  RotateCcw,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { MapPanel } from "@/components/MapPanel";
import { fetchComplaints } from "@/lib/complaints";
import { CATEGORIES, STATUSES, PRIORITIES } from "@/lib/infratrack";
import { useAuth } from "@/hooks/useAuth";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/map")({
  head: () => ({
    meta: [
      { title: "City Infrastructure Live Map — InfraTrack" },
      {
        name: "description",
        content:
          "Live geospatial map of reported potholes, streetlights, drainage, garbage and water issues across city wards.",
      },
      { property: "og:title", content: "City Infrastructure Live Map — InfraTrack" },
      {
        property: "og:description",
        content: "Explore live municipal infrastructure issues and resolution hotspots.",
      },
    ],
  }),
  component: MapRoute,
});

function MapRoute() {
  const { user } = useAuth();
  const content = <MapView />;

  if (user) return <AppShell title="City Infrastructure Map">{content}</AppShell>;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="sticky top-0 z-40 border-b border-border/80 bg-card/90 backdrop-blur-md px-4 py-3.5 md:px-8">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <span className="font-display font-bold text-foreground">InfraTrack</span>
              <p className="text-[10px] text-muted-foreground leading-none">Public City Map</p>
            </div>
          </Link>

          <div className="flex items-center gap-2.5">
            <Link to="/login">
              <Button variant="ghost" size="sm" className="text-xs">
                Sign in
              </Button>
            </Link>
            <Link to="/report">
              <Button size="sm" className="gap-1.5 text-xs font-semibold shadow-xs">
                <PlusCircle className="h-4 w-4" /> Report an Issue
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="p-4 md:p-8 max-w-7xl w-full mx-auto flex-1 space-y-4">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Live City Infrastructure Map
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Real-time geospatial distribution of municipal grievances across city wards.
          </p>
        </div>
        {content}
      </div>
    </div>
  );
}

function MapView() {
  const { data: complaints = [] } = useQuery({
    queryKey: ["complaints", "public"],
    queryFn: () => fetchComplaints(),
  });
  const [category, setCategory] = useState("all");
  const [status, setStatus] = useState("all");
  const [priority, setPriority] = useState("all");
  const [density, setDensity] = useState(false);

  const filtered = useMemo(
    () =>
      complaints.filter(
        (c) =>
          (category === "all" || c.category === category) &&
          (status === "all" || c.status === status) &&
          (priority === "all" || c.priority === priority),
      ),
    [complaints, category, status, priority],
  );

  const isFiltered = category !== "all" || status !== "all" || priority !== "all";

  const selectClass =
    "h-9 rounded-xl border border-border/80 bg-background px-3 text-xs font-medium shadow-2xs focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all";

  return (
    <div className="space-y-4">
      {/* Control & Filter Strip */}
      <div className="flex flex-wrap items-center gap-2.5 rounded-2xl border border-border/80 bg-card p-3.5 shadow-card">
        <select className={selectClass} value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="all">All Categories</option>
          {CATEGORIES.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>

        <select className={selectClass} value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="all">All Statuses</option>
          {STATUSES.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>

        <select className={selectClass} value={priority} onChange={(e) => setPriority(e.target.value)}>
          <option value="all">All Priorities</option>
          {PRIORITIES.map((p) => (
            <option key={p.value} value={p.value}>
              {p.label}
            </option>
          ))}
        </select>

        <Button
          variant={density ? "default" : "outline"}
          size="sm"
          onClick={() => setDensity((d) => !d)}
          className="gap-1.5 text-xs h-9"
        >
          <Layers className="h-3.5 w-3.5" />
          {density ? "Hotspot Density: ON" : "Density Heatmap"}
        </Button>

        {isFiltered ? (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setCategory("all");
              setStatus("all");
              setPriority("all");
            }}
            className="text-xs gap-1 text-muted-foreground h-9"
          >
            <RotateCcw className="h-3.5 w-3.5" /> Reset
          </Button>
        ) : null}

        <div className="ml-auto flex items-center gap-4 text-xs font-semibold text-muted-foreground">
          {/* Priority Legend */}
          <div className="hidden items-center gap-3 sm:flex">
            <span className="flex items-center gap-1">
              <span className="h-2.5 w-2.5 rounded-full bg-red-600 inline-block" /> High
            </span>
            <span className="flex items-center gap-1">
              <span className="h-2.5 w-2.5 rounded-full bg-blue-600 inline-block" /> Medium
            </span>
            <span className="flex items-center gap-1">
              <span className="h-2.5 w-2.5 rounded-full bg-teal-600 inline-block" /> Low
            </span>
          </div>

          <span className="rounded-full bg-muted px-2.5 py-1 text-foreground">
            {filtered.length} {filtered.length === 1 ? "Issue" : "Issues"}
          </span>
        </div>
      </div>

      {/* Map Container */}
      <MapPanel complaints={filtered} density={density} height="72vh" />
    </div>
  );
}
