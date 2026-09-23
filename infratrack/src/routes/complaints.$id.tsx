import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { RequireAuth } from "@/components/RequireAuth";
import { AppShell } from "@/components/AppShell";
import { StatusBadge, PriorityBadge } from "@/components/Badges";
import { StatusTimeline, type HistoryRow } from "@/components/StatusTimeline";
import { MapPanel } from "@/components/MapPanel";
import { supabase } from "@/integrations/supabase/client";
import type { Complaint } from "@/lib/complaints";
import { categoryLabel, formatDateTime } from "@/lib/infratrack";

export const Route = createFileRoute("/complaints/$id")({
  head: () => ({
    meta: [
      { title: "Complaint details — InfraTrack" },
      { name: "description", content: "Full history, location and status of a reported civic issue." },
      { property: "og:title", content: "Complaint details — InfraTrack" },
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

  if (isLoading) return <p className="text-sm text-muted-foreground">Loading…</p>;
  if (!data?.complaint) return <p className="text-sm text-muted-foreground">Complaint not found.</p>;

  const c = data.complaint;
  const department = data.departments.find((d) => d.id === c.department_id)?.name ?? "Unassigned";

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="space-y-6 lg:col-span-2">
        <div className="rounded-xl border bg-card p-5 shadow-card">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-xs text-muted-foreground">{c.complaint_id}</span>
            <StatusBadge status={c.status} />
            <PriorityBadge priority={c.priority} />
          </div>
          <h2 className="mt-3 font-display text-2xl font-semibold">{c.title}</h2>
          <p className="mt-2 text-sm text-muted-foreground">{c.description}</p>

          {c.image_url ? (
            <img
              src={c.image_url}
              alt={`Photo of the reported issue: ${c.title}`}
              loading="lazy"
              className="mt-4 max-h-72 w-full rounded-lg object-cover"
            />
          ) : null}

          <dl className="mt-5 grid gap-4 text-sm sm:grid-cols-2">
            <Field label="Category" value={categoryLabel(c.category)} />
            <Field label="Department" value={department} />
            <Field label="Location" value={c.address} />
            <Field label="Area" value={c.area || "—"} />
            <Field label="Reported" value={formatDateTime(c.created_at)} />
            <Field label="Last update" value={formatDateTime(c.updated_at)} />
            {c.resolved_at ? <Field label="Resolved" value={formatDateTime(c.resolved_at)} /> : null}
          </dl>

          {c.remarks ? (
            <div className="mt-5 rounded-lg bg-muted/50 p-3 text-sm">
              <p className="font-medium">Authority remarks</p>
              <p className="mt-1 text-muted-foreground">{c.remarks}</p>
            </div>
          ) : null}
        </div>

        <MapPanel
          complaints={[c]}
          center={[c.latitude, c.longitude]}
          zoom={15}
          height="320px"
        />
      </div>

      <div className="space-y-4 rounded-xl border bg-card p-5 shadow-card">
        <h3 className="font-medium">Progress</h3>
        <StatusTimeline status={c.status} history={data.history} />
        <Link to="/my-complaints" className="text-sm text-primary hover:underline">
          ← Back to my complaints
        </Link>
      </div>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs tracking-wide text-muted-foreground uppercase">{label}</dt>
      <dd className="mt-0.5">{value}</dd>
    </div>
  );
}
