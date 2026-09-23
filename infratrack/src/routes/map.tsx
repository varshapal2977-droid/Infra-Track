import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ShieldCheck } from "lucide-react";
import { MapPanel } from "@/components/MapPanel";
import { fetchComplaints } from "@/lib/complaints";
import { CATEGORIES, STATUSES, PRIORITIES } from "@/lib/infratrack";
import { useAuth } from "@/hooks/useAuth";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/map")({
  head: () => ({
    meta: [
      { title: "City Infrastructure Map — InfraTrack" },
      {
        name: "description",
        content:
          "Live map of reported potholes, streetlights, drainage, garbage and water issues across the city.",
      },
      { property: "og:title", content: "City Infrastructure Map — InfraTrack" },
      {
        property: "og:description",
        content: "See where civic issues are reported and which ones are still open.",
      },
    ],
  }),
  component: MapRoute,
});

function MapRoute() {
  const { user } = useAuth();
  const content = <MapView />;
  if (user) return <AppShell title="Infrastructure Map">{content}</AppShell>;
  return (
    <div className="min-h-screen bg-background">
      <header className="flex items-center gap-3 border-b bg-card px-4 py-4 md:px-10">
        <Link to="/" className="flex items-center gap-2">
          <span className="rounded-md bg-primary p-1.5 text-primary-foreground">
            <ShieldCheck className="h-4 w-4" />
          </span>
          <span className="font-display font-semibold">InfraTrack</span>
        </Link>
        <Link to="/login" className="ml-auto">
          <Button size="sm">Sign in to report</Button>
        </Link>
      </header>
      <div className="p-4 md:p-8">
        <h1 className="mb-4 font-display text-2xl font-semibold">Infrastructure Map</h1>
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

  const selectClass =
    "h-9 rounded-md border bg-background px-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-ring";

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2 rounded-xl border bg-card p-3 shadow-card">
        <select className={selectClass} value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="all">All categories</option>
          {CATEGORIES.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>
        <select className={selectClass} value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="all">All statuses</option>
          {STATUSES.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
        <select className={selectClass} value={priority} onChange={(e) => setPriority(e.target.value)}>
          <option value="all">All priorities</option>
          {PRIORITIES.map((p) => (
            <option key={p.value} value={p.value}>
              {p.label}
            </option>
          ))}
        </select>
        <Button variant={density ? "default" : "outline"} size="sm" onClick={() => setDensity((d) => !d)}>
          {density ? "Density on" : "Density off"}
        </Button>
        <span className="ml-auto text-sm text-muted-foreground">{filtered.length} issues</span>
      </div>
      <MapPanel complaints={filtered} density={density} height="70vh" />
    </div>
  );
}
