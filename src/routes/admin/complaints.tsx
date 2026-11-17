import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  ArrowRight,
  Building2,
  Check,
  CheckCircle2,
  Filter,
  Loader2,
  MapPin,
  RotateCcw,
  Search,
  Sparkles,
  X,
} from "lucide-react";
import { RequireAuth } from "@/components/RequireAuth";
import { AppShell } from "@/components/AppShell";
import { StatusBadge, PriorityBadge } from "@/components/Badges";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { fetchComplaints, fetchDepartments, updateStatus, type Complaint } from "@/lib/complaints";
import {
  CATEGORIES,
  PRIORITIES,
  STATUSES,
  categoryLabel,
  formatDate,
  type Status,
} from "@/lib/infratrack";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/admin/complaints")({
  head: () => ({
    meta: [
      { title: "Manage Municipal Complaints Queue — InfraTrack" },
      { name: "description", content: "Assign departments, set priority and update complaint status." },
      { property: "og:title", content: "Manage Complaints — InfraTrack" },
      { property: "og:description", content: "Authority workspace for resolving civic complaints." },
    ],
  }),
  component: () => (
    <RequireAuth admin>
      <AppShell title="Manage Complaints">
        <ManageComplaints />
      </AppShell>
    </RequireAuth>
  ),
});

const selectClass =
  "h-10 rounded-xl border border-border/80 bg-background px-3 text-xs font-medium shadow-2xs focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all";

function ManageComplaints() {
  const qc = useQueryClient();
  const { user } = useAuth();
  const { data = [], isLoading } = useQuery({
    queryKey: ["complaints", "all"],
    queryFn: () => fetchComplaints(),
  });
  const { data: departments = [] } = useQuery({
    queryKey: ["departments"],
    queryFn: fetchDepartments,
  });

  const [q, setQ] = useState("");
  const [status, setStatus] = useState("all");
  const [category, setCategory] = useState("all");
  const [priority, setPriority] = useState("all");
  const [selected, setSelected] = useState<Complaint | null>(null);

  const rows = useMemo(
    () =>
      data.filter(
        (c) =>
          (status === "all" || c.status === status) &&
          (category === "all" || c.category === category) &&
          (priority === "all" || c.priority === priority) &&
          (q === "" ||
            `${c.title} ${c.description} ${c.address} ${c.area ?? ""} ${c.complaint_id}`
              .toLowerCase()
              .includes(q.toLowerCase())),
      ),
    [data, q, status, category, priority],
  );

  const isFiltered = q !== "" || status !== "all" || category !== "all" || priority !== "all";

  function refresh() {
    qc.invalidateQueries({ queryKey: ["complaints"] });
  }

  function resetFilters() {
    setQ("");
    setStatus("all");
    setCategory("all");
    setPriority("all");
  }

  async function assign(c: Complaint, field: "department_id" | "priority", value: string) {
    const patch =
      field === "department_id"
        ? { department_id: value }
        : { priority: value as "low" | "medium" | "high" };
    const { error } = await supabase.from("complaints").update(patch).eq("id", c.id);
    if (error) {
      toast.error(error.message);
      return;
    }
    refresh();
    toast.success("Complaint updated successfully!");
  }

  return (
    <div className="space-y-6">
      {/* Search & Filter Controls Toolbar */}
      <div className="flex flex-col gap-3 rounded-2xl border border-border/80 bg-card p-4 shadow-card lg:flex-row lg:items-center lg:justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="pl-9 pr-8 text-sm h-10 rounded-xl"
            placeholder="Search issue, ticket ID, area..."
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

          <select className={selectClass} value={priority} onChange={(e) => setPriority(e.target.value)}>
            <option value="all">All Priorities</option>
            {PRIORITIES.map((p) => (
              <option key={p.value} value={p.value}>
                {p.label}
              </option>
            ))}
          </select>

          {isFiltered ? (
            <Button variant="ghost" size="sm" onClick={resetFilters} className="text-xs gap-1 text-muted-foreground">
              <RotateCcw className="h-3.5 w-3.5" /> Reset
            </Button>
          ) : null}

          <span className="ml-auto text-xs font-semibold text-muted-foreground">
            {rows.length} {rows.length === 1 ? "Complaint" : "Complaints"}
          </span>
        </div>
      </div>

      {/* Main Table / Mobile Cards */}
      {isLoading ? (
        <div className="rounded-2xl border bg-card p-12 text-center text-sm text-muted-foreground shadow-card">
          <Loader2 className="mx-auto h-6 w-6 animate-spin text-primary" />
          <p className="mt-2 font-medium">Loading complaints queue...</p>
        </div>
      ) : rows.length === 0 ? (
        <div className="rounded-2xl border bg-card p-12 text-center space-y-3 shadow-card">
          <h3 className="font-display text-base font-bold text-foreground">No complaints match these filters</h3>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto">
            Try adjusting your search criteria or reset filters to view all incoming work orders.
          </p>
          {isFiltered ? (
            <Button size="sm" variant="outline" onClick={resetFilters}>
              Clear Filters
            </Button>
          ) : null}
        </div>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden lg:block overflow-hidden rounded-2xl border border-border/80 bg-card shadow-card">
            <table className="w-full text-sm">
              <thead className="bg-muted/40 text-left text-[11px] font-bold tracking-wider text-muted-foreground uppercase border-b border-border/80">
                <tr>
                  <th className="px-4 py-3.5">ID</th>
                  <th className="px-4 py-3.5">Issue & Landmark</th>
                  <th className="px-4 py-3.5">Category</th>
                  <th className="px-4 py-3.5">Department</th>
                  <th className="px-4 py-3.5">Priority</th>
                  <th className="px-4 py-3.5">Status</th>
                  <th className="px-4 py-3.5">Reported</th>
                  <th className="px-4 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {rows.map((c) => (
                  <tr key={c.id} className="group hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3.5 font-mono text-xs font-bold text-muted-foreground">
                      {c.complaint_id}
                    </td>
                    <td className="px-4 py-3.5 max-w-xs">
                      <Link
                        to="/complaints/$id"
                        params={{ id: c.id }}
                        className="font-display font-bold text-foreground group-hover:text-primary transition-colors line-clamp-1"
                      >
                        {c.title}
                      </Link>
                      <p className="flex items-center gap-1 text-xs text-muted-foreground truncate mt-0.5">
                        <MapPin className="h-3 w-3 text-primary shrink-0" />
                        {c.area ?? c.address}
                      </p>
                    </td>
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <span className="rounded-lg bg-muted px-2 py-0.5 text-xs font-medium text-foreground">
                        {categoryLabel(c.category)}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <select
                        className="h-8 rounded-lg border border-border/80 bg-background px-2 text-xs font-medium focus:ring-1 focus:ring-primary shadow-2xs max-w-[160px] truncate"
                        value={c.department_id ?? ""}
                        onChange={(e) => assign(c, "department_id", e.target.value)}
                      >
                        <option value="">Unassigned</option>
                        {departments.map((d) => (
                          <option key={d.id} value={d.id}>
                            {d.name}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-3.5">
                      <PriorityBadge priority={c.priority} />
                    </td>
                    <td className="px-4 py-3.5">
                      <StatusBadge status={c.status} />
                    </td>
                    <td className="px-4 py-3.5 whitespace-nowrap text-xs text-muted-foreground">
                      {formatDate(c.created_at)}
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <Button size="sm" variant="outline" className="h-8 text-xs font-semibold" onClick={() => setSelected(c)}>
                        Update Status
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile / Tablet Cards */}
          <div className="grid gap-3.5 lg:hidden">
            {rows.map((c) => (
              <div
                key={c.id}
                className="rounded-2xl border border-border/80 bg-card p-4.5 shadow-2xs space-y-3"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-xs font-bold text-muted-foreground">{c.complaint_id}</span>
                  <div className="flex items-center gap-1.5">
                    <PriorityBadge priority={c.priority} />
                    <StatusBadge status={c.status} />
                  </div>
                </div>

                <div>
                  <Link
                    to="/complaints/$id"
                    params={{ id: c.id }}
                    className="font-display text-sm font-bold text-foreground line-clamp-1"
                  >
                    {c.title}
                  </Link>
                  <p className="flex items-center gap-1 text-xs text-muted-foreground mt-1 truncate">
                    <MapPin className="h-3 w-3 text-primary shrink-0" /> {c.area ?? c.address}
                  </p>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border/60 pt-3 text-xs">
                  <span className="rounded bg-muted px-2 py-0.5 text-[11px] text-muted-foreground">
                    {categoryLabel(c.category)}
                  </span>
                  <Button size="sm" variant="outline" className="text-xs h-8 font-semibold" onClick={() => setSelected(c)}>
                    Update Status
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {selected ? (
        <UpdateDialog
          complaint={selected}
          actorId={user?.id ?? ""}
          onClose={() => setSelected(null)}
          onDone={() => {
            setSelected(null);
            refresh();
          }}
        />
      ) : null}
    </div>
  );
}

function UpdateDialog({
  complaint,
  actorId,
  onClose,
  onDone,
}: {
  complaint: Complaint;
  actorId: string;
  onClose: () => void;
  onDone: () => void;
}) {
  const [status, setStatus] = useState<Status>(complaint.status as Status);
  const [remarks, setRemarks] = useState(complaint.remarks ?? "");
  const [saving, setSaving] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      await updateStatus(complaint, status, remarks, actorId);
      toast.success(`${complaint.complaint_id} updated successfully!`);
      onDone();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not update complaint");
    } finally {
      setSaving(false);
    }
  }

  const QUICK_REMARKS = [
    "Inspection crew dispatched to site.",
    "Road crew asphalt patching in progress.",
    "Electrical fault repaired & power restored.",
    "Drain cleared; water flow back to normal.",
    "Repairs completed, inspected and verified.",
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <form
        onSubmit={submit}
        className="w-full max-w-lg space-y-4 rounded-2xl border border-border/80 bg-card p-6 shadow-xl"
      >
        <div className="flex items-start justify-between border-b pb-3">
          <div>
            <h3 className="font-display text-lg font-bold text-foreground">{complaint.title}</h3>
            <p className="font-mono text-xs text-muted-foreground mt-0.5">{complaint.complaint_id}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-foreground/80">New Status</label>
          <select
            className={selectClass + " w-full h-10 text-sm"}
            value={status}
            onChange={(e) => setStatus(e.target.value as Status)}
          >
            {STATUSES.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-semibold text-foreground/80">
            Official Remarks for Citizen Tracking
          </label>
          <Textarea
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            rows={3}
            placeholder="e.g. Repair crew dispatched with heavy roller machinery."
            className="text-sm leading-relaxed"
          />

          {/* Quick Remark Presets */}
          <div className="space-y-1.5 pt-1">
            <span className="text-[11px] font-semibold text-muted-foreground">Quick Presets:</span>
            <div className="flex flex-wrap gap-1.5">
              {QUICK_REMARKS.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setRemarks(preset)}
                  className="rounded-lg border border-border/80 bg-muted/30 px-2 py-1 text-[11px] text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2.5 border-t pt-4">
          <Button type="button" variant="ghost" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" size="sm" className="font-semibold shadow-xs" disabled={saving}>
            {saving ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" /> Saving...
              </>
            ) : (
              "Save & Notify Citizen"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
