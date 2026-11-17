import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Building2, CheckCircle2, Clock, PlusCircle, ShieldCheck } from "lucide-react";
import { RequireAuth } from "@/components/RequireAuth";
import { AppShell } from "@/components/AppShell";
import { supabase } from "@/integrations/supabase/client";
import { fetchComplaints, fetchDepartments } from "@/lib/complaints";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/admin/departments")({
  head: () => ({
    meta: [
      { title: "Municipal Departments & Wings — InfraTrack" },
      { name: "description", content: "Civic departments handling infrastructure complaints." },
      { property: "og:title", content: "Departments — InfraTrack" },
      { property: "og:description", content: "Manage the departments that resolve city issues." },
    ],
  }),
  component: () => (
    <RequireAuth admin>
      <AppShell title="Departments">
        <Departments />
      </AppShell>
    </RequireAuth>
  ),
});

function Departments() {
  const qc = useQueryClient();
  const { data: departments = [] } = useQuery({
    queryKey: ["departments"],
    queryFn: fetchDepartments,
  });
  const { data: complaints = [] } = useQuery({
    queryKey: ["complaints", "all"],
    queryFn: () => fetchComplaints(),
  });
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [busy, setBusy] = useState(false);

  async function addDepartment(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setBusy(true);
    const { error } = await supabase
      .from("departments")
      .insert({ name: name.trim(), description: description.trim() || null });
    setBusy(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    setName("");
    setDescription("");
    qc.invalidateQueries({ queryKey: ["departments"] });
    toast.success(`Department "${name}" registered successfully!`);
  }

  const stats = (id: string) => {
    const rows = complaints.filter((c) => c.department_id === id);
    const resolved = rows.filter((c) => c.status === "resolved").length;
    const open = rows.filter((c) => c.status !== "resolved" && c.status !== "rejected").length;
    const rate = rows.length > 0 ? Math.round((resolved / rows.length) * 100) : 0;
    return {
      total: rows.length,
      open,
      resolved,
      rate,
    };
  };

  return (
    <div className="space-y-6">
      {/* Overview & Add Form Card */}
      <div className="rounded-2xl border border-border/80 bg-card p-6 shadow-card space-y-4">
        <div>
          <h2 className="font-display text-lg font-bold text-foreground">
            Register a Municipal Maintenance Wing
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Departments receive automated ticket dispatches based on the category chosen during citizen reporting.
          </p>
        </div>

        <form onSubmit={addDepartment} className="grid gap-3 sm:grid-cols-12 items-end pt-1">
          <div className="space-y-1 sm:col-span-5">
            <Label className="text-xs font-semibold text-foreground/80">Department Name</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Urban Parks & Horticulture"
              className="h-10 text-sm"
              required
            />
          </div>

          <div className="space-y-1 sm:col-span-5">
            <Label className="text-xs font-semibold text-foreground/80">Operational Mandate</Label>
            <Input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Maintains public garden footpaths and tree safety"
              className="h-10 text-sm"
            />
          </div>

          <div className="sm:col-span-2">
            <Button type="submit" className="w-full h-10 gap-1.5 font-semibold shadow-xs" disabled={busy}>
              <PlusCircle className="h-4 w-4" /> Add Wing
            </Button>
          </div>
        </form>
      </div>

      {/* Departments Grid */}
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {departments.map((d) => {
          const s = stats(d.id);
          return (
            <div
              key={d.id}
              className="group flex flex-col justify-between rounded-2xl border border-border/80 bg-card p-6 shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:shadow-card-hover"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Building2 className="h-5 w-5" />
                  </div>
                  <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-bold text-foreground">
                    {s.rate}% Resolved
                  </span>
                </div>

                <div>
                  <h3 className="font-display text-base font-bold text-foreground group-hover:text-primary transition-colors">
                    {d.name}
                  </h3>
                  <p className="mt-1 line-clamp-2 text-xs text-muted-foreground leading-relaxed">
                    {d.description ?? "Handles designated municipal infrastructure maintenance."}
                  </p>
                </div>
              </div>

              {/* Progress Indicator */}
              <div className="mt-5 space-y-2 border-t border-border/60 pt-4">
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-emerald-500 transition-all duration-300"
                    style={{ width: `${s.rate}%` }}
                  />
                </div>

                <dl className="grid grid-cols-3 gap-2 text-center text-xs pt-1">
                  <div className="rounded-xl bg-muted/40 p-2">
                    <dt className="text-[10px] font-semibold text-muted-foreground uppercase">Total</dt>
                    <dd className="mt-0.5 font-display text-sm font-bold text-foreground">{s.total}</dd>
                  </div>
                  <div className="rounded-xl bg-amber-500/10 p-2 text-amber-700 dark:text-amber-400">
                    <dt className="text-[10px] font-semibold uppercase">Open</dt>
                    <dd className="mt-0.5 font-display text-sm font-bold">{s.open}</dd>
                  </div>
                  <div className="rounded-xl bg-emerald-500/10 p-2 text-emerald-700 dark:text-emerald-400">
                    <dt className="text-[10px] font-semibold uppercase">Resolved</dt>
                    <dd className="mt-0.5 font-display text-sm font-bold">{s.resolved}</dd>
                  </div>
                </dl>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
