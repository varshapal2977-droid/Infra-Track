import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { BarChart3, MapPin, ShieldCheck, Siren, Workflow } from "lucide-react";
import { fetchComplaints } from "@/lib/complaints";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "InfraTrack — Report & Track Civic Infrastructure Issues" },
      {
        name: "description",
        content:
          "InfraTrack lets citizens report potholes, streetlights, drainage and sanitation issues, and lets city authorities track resolution on a live map.",
      },
      { property: "og:title", content: "InfraTrack — Civic Infrastructure Complaints" },
      {
        property: "og:description",
        content: "Report civic issues, follow their status and see city-wide resolution analytics.",
      },
    ],
  }),
  component: Landing,
});

function Landing() {
  const { user, isAdmin } = useAuth();
  const { data: complaints = [] } = useQuery({
    queryKey: ["complaints", "public"],
    queryFn: () => fetchComplaints(),
  });

  const resolved = complaints.filter((c) => c.status === "resolved").length;
  const open = complaints.length - resolved;

  return (
    <div className="min-h-screen bg-background">
      <header className="flex items-center gap-3 border-b bg-card px-4 py-4 md:px-10">
        <span className="rounded-md bg-primary p-1.5 text-primary-foreground">
          <ShieldCheck className="h-5 w-5" />
        </span>
        <span className="font-display text-lg font-semibold">InfraTrack</span>
        <nav className="ml-auto flex items-center gap-2 text-sm">
          <Link to="/map" className="hidden px-3 py-2 hover:text-primary sm:block">
            City Map
          </Link>
          <Link to="/about" className="hidden px-3 py-2 hover:text-primary sm:block">
            About
          </Link>
          {user ? (
            <Link to={isAdmin ? "/admin" : "/dashboard"}>
              <Button size="sm">Go to dashboard</Button>
            </Link>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost" size="sm">
                  Sign in
                </Button>
              </Link>
              <Link to="/register">
                <Button size="sm">Create account</Button>
              </Link>
            </>
          )}
        </nav>
      </header>

      <section className="mx-auto grid max-w-6xl gap-10 px-4 py-14 md:grid-cols-2 md:px-10 md:py-20">
        <div>
          <p className="text-xs font-semibold tracking-widest text-accent-foreground uppercase">
            Civic infrastructure platform
          </p>
          <h1 className="mt-3 font-display text-4xl leading-tight font-semibold md:text-5xl">
            Report city issues. Watch them get fixed.
          </h1>
          <p className="mt-4 text-muted-foreground">
            Potholes, broken streetlights, blocked drains, garbage and water leaks — pin the exact
            location, send it to the right department and follow every status update until
            resolution.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link to="/report">
              <Button size="lg">Report an issue</Button>
            </Link>
            <Link to="/map">
              <Button size="lg" variant="outline">
                Explore the map
              </Button>
            </Link>
          </div>
          <div className="mt-9 grid grid-cols-3 gap-4 text-center">
            {[
              { label: "Complaints", value: complaints.length },
              { label: "Resolved", value: resolved },
              { label: "In queue", value: open },
            ].map((s) => (
              <div key={s.label} className="rounded-xl border bg-card p-4 shadow-card">
                <p className="font-display text-2xl font-semibold">{s.value}</p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-4 self-start sm:grid-cols-2">
          {[
            {
              icon: MapPin,
              title: "Pin-point reporting",
              body: "Drop a marker on the map or use your current location with the full address.",
            },
            {
              icon: Workflow,
              title: "Smart routing",
              body: "Each category is routed to the right department with a suggested priority.",
            },
            {
              icon: Siren,
              title: "Live status trail",
              body: "Pending, Assigned, In Progress, Resolved — with remarks at every step.",
            },
            {
              icon: BarChart3,
              title: "Open analytics",
              body: "Category trends, department load and resolution rates for the whole city.",
            },
          ].map((f) => (
            <div key={f.title} className="rounded-xl border bg-card p-5 shadow-card">
              <f.icon className="h-5 w-5 text-primary" />
              <p className="mt-3 font-medium">{f.title}</p>
              <p className="mt-1 text-sm text-muted-foreground">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t bg-card px-4 py-6 text-center text-sm text-muted-foreground md:px-10">
        InfraTrack · A civic maintenance tracking platform
      </footer>
    </div>
  );
}
