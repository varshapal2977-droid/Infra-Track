import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowLeft,
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  Compass,
  FileText,
  ImageIcon,
  Info,
  Loader2,
  MapPin,
  MessageSquare,
  ShieldCheck,
} from "lucide-react";
import { RequireAuth } from "@/components/RequireAuth";
import { AppShell } from "@/components/AppShell";
import { StatusBadge, PriorityBadge } from "@/components/Badges";
import { StatusTimeline, type HistoryRow } from "@/components/StatusTimeline";
import { MapPanel } from "@/components/MapPanel";
import { supabase } from "@/integrations/supabase/client";
import type { Complaint } from "@/lib/complaints";
import { categoryLabel, formatDateTime } from "@/lib/infratrack";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/complaints/$id")({
  head: () => ({
    meta: [
      { title: "Complaint Details & Audit Trail — InfraTrack" },
      { name: "description", content: "Full history, location and status of a reported civic issue." },
      { property: "og:title", content: "Complaint Details — InfraTrack" },
      { property: "og:description", content: "See how a reported civic issue is progressing." },
    ],
  }),
  component: () => (
    <RequireAuth>
      <AppShell title="Complaint Details">
        <Details />
      </AppShell>
    </RequireAuth>
  ),
});

function Details() {
  const { id } = Route.useParams();

  const { data, isLoading } = useQuery({
    queryKey: ["complaint", id],
    queryFn: async () => {
      const [{ data: complaint, error }, { data: history }, { data: departments }] =
        await Promise.all([
          supabase.from("complaints").select("*").eq("id", id).maybeSingle(),
          supabase
            .from("status_history")
            .select("*")
            .eq("complaint_id", id)
            .order("changed_at", { ascending: true }),
          supabase.from("departments").select("id, name"),
        ]);
      if (error) throw error;
      return {
        complaint: complaint as Complaint | null,
        history: (history ?? []) as HistoryRow[],
        departments: departments ?? [],
      };
    },
  });

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center rounded-2xl border bg-card shadow-card">
        <div className="text-center space-y-2">
          <Loader2 className="mx-auto h-6 w-6 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading complaint record...</p>
        </div>
      </div>
    );
  }

  if (!data?.complaint) {
    return (
      <div className="rounded-2xl border bg-card p-12 text-center shadow-card space-y-3">
        <h2 className="font-display text-xl font-bold text-foreground">Complaint Not Found</h2>
        <p className="text-sm text-muted-foreground max-w-md mx-auto">
          The requested complaint identifier does not exist or has been removed from the database.
        </p>
        <Link to="/my-complaints">
          <Button variant="outline" size="sm" className="gap-1.5 mt-2">
            <ArrowLeft className="h-4 w-4" /> Back to My Complaints
          </Button>
        </Link>
      </div>
    );
  }

  const c = data.complaint;
  const department = data.departments.find((d) => d.id === c.department_id)?.name ?? "Unassigned Department";

  return (
    <div className="space-y-6">
      {/* Back Link */}
      <div>
        <Link
          to="/my-complaints"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to My Complaints
        </Link>
      </div>

      <div className="grid gap-8 lg:grid-cols-12 items-start">
        {/* Main Details Column */}
        <div className="space-y-6 lg:col-span-8">
          <div className="rounded-2xl border border-border/80 bg-card p-6 shadow-card space-y-5">
            {/* Ticket Header Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/80 pb-4">
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm font-bold text-foreground bg-muted/80 px-2.5 py-1 rounded-lg">
                  {c.complaint_id}
                </span>
                <span className="rounded-lg bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
                  {categoryLabel(c.category)}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <PriorityBadge priority={c.priority} />
                <StatusBadge status={c.status} />
              </div>
            </div>

            {/* Title & Description */}
            <div className="space-y-2">
              <h2 className="font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                {c.title}
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                {c.description}
              </p>
            </div>

            {/* Attached Photo */}
            {c.image_url ? (
              <div className="space-y-1.5 pt-2">
                <span className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
                  <ImageIcon className="h-3.5 w-3.5 text-primary" /> Attached Photographic Evidence
                </span>
                <div className="overflow-hidden rounded-xl border border-border/80 bg-muted/30">
                  <img
                    src={c.image_url}
                    alt={`Photo of ${c.title}`}
                    loading="lazy"
                    className="max-h-96 w-full object-cover transition-transform duration-300 hover:scale-[1.01]"
                  />
                </div>
              </div>
            ) : null}

            {/* Detailed Properties Grid */}
            <div className="border-t border-border/80 pt-5">
              <h4 className="text-xs font-bold tracking-wider text-muted-foreground uppercase mb-3">
                Municipal Metadata
              </h4>
              <dl className="grid gap-4 sm:grid-cols-2 text-sm">
                <Field
                  icon={Building2}
                  label="Assigned Department"
                  value={department}
                />
                <Field
                  icon={MapPin}
                  label="Street Landmark"
                  value={c.address}
                />
                <Field
                  icon={Compass}
                  label="Ward / Municipal Area"
                  value={c.area || "City Core Ward"}
                />
                <Field
                  icon={Calendar}
                  label="Date Logged"
                  value={formatDateTime(c.created_at)}
                />
                <Field
                  icon={Clock}
                  label="Last Audit Timestamp"
                  value={formatDateTime(c.updated_at)}
                />
                {c.resolved_at ? (
                  <Field
                    icon={CheckCircle2}
                    label="Official Resolution Timestamp"
                    value={formatDateTime(c.resolved_at)}
                    highlight
                  />
                ) : null}
              </dl>
            </div>

            {/* Official Authority Remarks */}
            {c.remarks ? (
              <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 space-y-1.5">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-4.5 w-4.5 text-primary" />
                  <p className="text-xs font-bold text-primary uppercase tracking-wide">
                    Official Municipal Authority Remarks
                  </p>
                </div>
                <p className="text-sm text-foreground/90 leading-relaxed">{c.remarks}</p>
              </div>
            ) : null}
          </div>

          {/* Location Map View */}
          <div className="rounded-2xl border border-border/80 bg-card p-5 shadow-card space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-display text-base font-bold text-foreground">Incident Geotag</h3>
                <p className="text-xs text-muted-foreground">Marked GPS coordinates for repair truck navigation</p>
              </div>
              <span className="font-mono text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded">
                {c.latitude.toFixed(4)}°N, {c.longitude.toFixed(4)}°E
              </span>
            </div>
            <div className="overflow-hidden rounded-xl border">
              <MapPanel
                complaints={[c]}
                center={[c.latitude, c.longitude]}
                zoom={16}
                height="340px"
              />
            </div>
          </div>
        </div>

        {/* Sidebar: Progress Stepper */}
        <div className="space-y-6 lg:col-span-4 lg:sticky lg:top-20">
          <div className="rounded-2xl border border-border/80 bg-card p-6 shadow-card space-y-5">
            <div>
              <h3 className="font-display text-base font-bold text-foreground">Resolution Timeline</h3>
              <p className="text-xs text-muted-foreground">Live status progression & inspection audit</p>
            </div>

            <StatusTimeline status={c.status} history={data.history} />
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({
  icon: Icon,
  label,
  value,
  highlight = false,
}: {
  icon: typeof Building2;
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="rounded-xl bg-muted/40 p-3 space-y-1">
      <dt className="flex items-center gap-1.5 text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">
        <Icon className="h-3.5 w-3.5 text-primary shrink-0" />
        {label}
      </dt>
      <dd className={`text-xs font-medium ${highlight ? "text-emerald-700 dark:text-emerald-400 font-bold" : "text-foreground"}`}>
        {value}
      </dd>
    </div>
  );
}
