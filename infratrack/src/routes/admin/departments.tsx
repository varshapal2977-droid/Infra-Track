import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { RequireAuth } from "@/components/RequireAuth";
import { AppShell } from "@/components/AppShell";
import { supabase } from "@/integrations/supabase/client";
import { fetchComplaints, fetchDepartments } from "@/lib/complaints";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/admin/departments")({
  head: () => ({
    meta: [
      { title: "Departments — InfraTrack" },
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

  async function addDepartment(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    const { error } = await supabase
      .from("departments")
      .insert({ name: name.trim(), description: description.trim() || null });
    if (error) {
      toast.error(error.message);
      return;
    }
    setName("");
    setDescription("");
    qc.invalidateQueries({ queryKey: ["departments"] });
    toast.success("Department added");
  }

  const stats = (id: string) => {
    const rows = complaints.filter((c) => c.department_id === id);
    return {
      total: rows.length,
      open: rows.filter((c) => c.status !== "resolved" && c.status !== "rejected").length,
      resolved: rows.filter((c) => c.status === "resolved").length,
    };
  };

  return (
    <div className="space-y-6">
      <form
        onSubmit={addDepartment}
        className="flex flex-wrap items-end gap-3 rounded-xl border bg-card p-4 shadow-card"
      >
        <div className="flex-1 min-w-48">
          <label className="text-sm font-medium">Department name</label>
          <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Parks Department" />
        </div>
        <div className="flex-1 min-w-48">
          <label className="text-sm font-medium">Description</label>
          <Input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Maintains public parks and green spaces"
          />
        </div>
        <Button type="submit">Add department</Button>
      </form>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {departments.map((d) => {
          const s = stats(d.id);
          return (
            <div key={d.id} className="rounded-xl border bg-card p-5 shadow-card">
              <h3 className="font-display font-semibold">{d.name}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{d.description ?? "—"}</p>
              <dl className="mt-4 grid grid-cols-3 gap-2 text-center text-sm">
                <div className="rounded-md bg-muted/50 p-2">
                  <dt className="text-xs text-muted-foreground">Total</dt>
                  <dd className="font-semibold">{s.total}</dd>
                </div>
                <div className="rounded-md bg-muted/50 p-2">
                  <dt className="text-xs text-muted-foreground">Open</dt>
                  <dd className="font-semibold">{s.open}</dd>
                </div>
                <div className="rounded-md bg-muted/50 p-2">
                  <dt className="text-xs text-muted-foreground">Resolved</dt>
                  <dd className="font-semibold">{s.resolved}</dd>
                </div>
              </dl>
            </div>
          );
        })}
      </div>
    </div>
  );
}
