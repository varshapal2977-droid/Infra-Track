import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  CheckCircle2,
  KeyRound,
  Lock,
  MapPin,
  ShieldCheck,
  Sparkles,
  Users2,
  Workflow,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About InfraTrack — How Civic Complaints Are Handled" },
      {
        name: "description",
        content:
          "How InfraTrack routes citizen complaints to city departments, tracks status changes and publishes resolution analytics.",
      },
      { property: "og:title", content: "About InfraTrack" },
      {
        property: "og:description",
        content: "How citizen complaints move from report to resolution on InfraTrack.",
      },
    ],
  }),
  component: About,
});

function About() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Top Bar */}
      <header className="border-b border-border/80 bg-card/90 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <span className="font-display text-base font-bold text-foreground">InfraTrack</span>
          </Link>
          <Link to="/">
            <Button variant="ghost" size="sm" className="gap-1.5 text-xs">
              <ArrowLeft className="h-3.5 w-3.5" /> Back to Home
            </Button>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 py-12 md:py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 space-y-12">
          {/* Header */}
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-semibold text-primary">
              <ShieldCheck className="h-3.5 w-3.5" /> Platform Architecture & Mission
            </div>
            <h1 className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl text-foreground">
              Empowering Cities Through Transparent Infrastructure Redressal
            </h1>
            <p className="text-base text-muted-foreground leading-relaxed">
              InfraTrack is an open municipal accountability bridge connecting city residents directly with engineers, maintenance crews, and public works authorities.
            </p>
          </div>

          {/* Workflow Cards */}
          <div className="space-y-4">
            <h2 className="font-display text-xl font-bold text-foreground">
              How the System Operates
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-border/80 bg-card p-5 shadow-2xs space-y-2.5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <MapPin className="h-5 w-5" />
                </div>
                <h3 className="font-display text-base font-bold text-foreground">1. Citizen Geotagging</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Residents drop an exact GPS marker on the map, choose from 8 defined infrastructure categories, and upload descriptions and photo links.
                </p>
              </div>

              <div className="rounded-2xl border border-border/80 bg-card p-5 shadow-2xs space-y-2.5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Workflow className="h-5 w-5" />
                </div>
                <h3 className="font-display text-base font-bold text-foreground">2. Smart Department Routing</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  The category decides the department (Roads, Power, Water, Sanitation, PWD), and automated text heuristics evaluate urgency keywords for priority scoring.
                </p>
              </div>

              <div className="rounded-2xl border border-border/80 bg-card p-5 shadow-2xs space-y-2.5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
                <h3 className="font-display text-base font-bold text-foreground">3. Real-Time Status Trail</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Authorities advance tickets through Assigned, In Progress, and Resolved with time-stamped inspection notes that reporters can follow in real-time.
                </p>
              </div>

              <div className="rounded-2xl border border-border/80 bg-card p-5 shadow-2xs space-y-2.5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Users2 className="h-5 w-5" />
                </div>
                <h3 className="font-display text-base font-bold text-foreground">4. City-Wide Open Data</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Every citizen can view the public density map, category breakdown, and ward resolution statistics to hold elected officials accountable.
                </p>
              </div>
            </div>
          </div>

          {/* Role Access Security */}
          <div className="rounded-2xl border border-border/80 bg-card p-6 shadow-2xs space-y-4">
            <div className="flex items-center gap-2">
              <Lock className="h-5 w-5 text-primary" />
              <h2 className="font-display text-lg font-bold text-foreground">Security & Data Privacy</h2>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              InfraTrack utilizes per-user database row-level security. Only the reporting citizen and authorized municipal officers can modify complaint remarks or status. All data is encrypted in transit and at rest.
            </p>
          </div>

          {/* Demo Access Highlight Card */}
          <div className="rounded-2xl border border-amber-500/30 bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent p-6 shadow-2xs space-y-4">
            <div className="flex items-center gap-2">
              <KeyRound className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              <h2 className="font-display text-lg font-bold text-foreground">
                Evaluator & Authority Demo Access
              </h2>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              You can test both sides of the platform. After signing up for a free account, navigate to your <strong>Profile</strong> page and enter the official demo authority code:
            </p>
            <div className="flex items-center gap-3">
              <code className="rounded-xl border border-amber-500/30 bg-card px-3.5 py-2 font-mono text-sm font-bold text-foreground shadow-2xs select-all">
                INFRA-ADMIN-2026
              </code>
              <Link to="/profile">
                <Button size="sm" variant="secondary" className="font-medium text-xs">
                  Go to Profile →
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/80 bg-card py-6 text-center text-xs text-muted-foreground">
        InfraTrack · Municipal Grievance Redressal Initiative
      </footer>
    </div>
  );
}
