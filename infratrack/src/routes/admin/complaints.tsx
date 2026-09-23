import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
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
      { title: "Manage complaints — InfraTrack" },
      { name: "description", content: "Assign departments, set priority and update complaint status." },
      { property: "og:title", content: "Manage complaints — InfraTrack" },
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
  "h-10 rounded-md border bg-background px-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-ring";

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

  function refresh() {
    qc.invalidateQueries({ queryKey: ["complaints"] });
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
    toast.success("Complaint updated");
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2 rounded-xl border bg-card p-3 shadow-card">
        <Input
          className="max-w-xs"
          placeholder="Search issue, ID, area"
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
        <select
          className={selectClass}
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="all">All categories</option>
          {CATEGORIES.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>
        <select
          className={selectClass}
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
        >
          <option value="all">All priorities</option>
          {PRIORITIES.map((p) => (
            <option key={p.value} value={p.value}>
              {p.label}
            </option>
          ))}
        </select>
        <span className="ml-auto self-center text-sm text-muted-foreground">
          {rows.length} complaint{rows.length === 1 ? "" : "s"}
        </span>
      </div>

      <div className="overflow-x-auto rounded-xl border bg-card shadow-card">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-left text-xs tracking-wide text-muted-foreground uppercase">
            <tr>
              <th className="px-4 py-3">ID</th>
              <th className="px-4 py-3">Issue</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Department</th>
              <th className="px-4 py-3">Priority</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Reported</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y">
            {isLoading ? (
              <tr>
                <td colSpan={8} className="px-4 py-6 text-muted-foreground">
                  Loading…
                </td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-6 text-muted-foreground">
                  No complaints match these filters.
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
                    <p className="text-xs text-muted-foreground">{c.area ?? c.address}</p>
                  </td>
                  <td className="px-4 py-3">{categoryLabel(c.category)}</td>
                  <td className="px-4 py-3">
                    <select
                      className={selectClass}
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
                  <td className="px-4 py-3">
                    <PriorityBadge priority={c.priority} />
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={c.status} />
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">{formatDate(c.created_at)}</td>
                  <td className="px-4 py-3">
                    <Button size="sm" variant="outline" onClick={() => setSelected(c)}>
                      Update
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

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
  const [remarks, setRemarks] = useState("");
  const [saving, setSaving] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      await updateStatus(complaint, status, remarks, actorId);
      toast.success(`${complaint.complaint_id} updated`);
      onDone();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not update complaint");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 p-4">
      <form
        onSubmit={submit}
        className="w-full max-w-md space-y-4 rounded-xl border bg-card p-5 shadow-lg"
      >
        <div>
          <h3 className="font-display text-lg font-semibold">{complaint.title}</h3>
          <p className="text-xs text-muted-foreground">{complaint.complaint_id}</p>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">New status</label>
          <select
            className={selectClass + " w-full"}
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
          <label className="text-sm font-medium">Remarks for the citizen</label>
          <Textarea
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            placeholder="Crew scheduled for tomorrow morning."
          />
        </div>
        <div className="flex justify-end gap-2">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={saving}>
            {saving ? "Saving…" : "Save update"}
          </Button>
        </div>
      </form>
    </div>
  );
}
