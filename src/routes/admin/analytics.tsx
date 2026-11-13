import { useMemo } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { RequireAuth } from "@/components/RequireAuth";
import { AppShell } from "@/components/AppShell";
import { fetchComplaints, fetchDepartments } from "@/lib/complaints";
import { CATEGORIES, STATUSES, categoryLabel, statusLabel } from "@/lib/infratrack";

export const Route = createFileRoute("/admin/analytics")({
  head: () => ({
    meta: [
      { title: "Analytics — InfraTrack" },
      { name: "description", content: "Charts on complaint volume, categories and resolution times." },
      { property: "og:title", content: "Analytics — InfraTrack" },
      { property: "og:description", content: "Insights into civic complaint trends across the city." },
    ],
  }),
  component: () => (
    <RequireAuth admin>
      <AppShell title="Analytics">
        <Analytics />
      </AppShell>
    </RequireAuth>
  ),
});

const COLORS = [
  "hsl(var(--chart-1, 190 70% 35%))",
  "#0f766e",
  "#f59e0b",
  "#2563eb",
  "#dc2626",
  "#7c3aed",
  "#059669",
  "#64748b",
];

function Analytics() {
  const { data: complaints = [], isLoading } = useQuery({
    queryKey: ["complaints", "all"],
    queryFn: () => fetchComplaints(),
  });
  const { data: departments = [] } = useQuery({
    queryKey: ["departments"],
    queryFn: fetchDepartments,
  });

  const byCategory = useMemo(
    () =>
      CATEGORIES.map((c) => ({
        name: categoryLabel(c.value),
        count: complaints.filter((x) => x.category === c.value).length,
      })).filter((r) => r.count > 0),
    [complaints],
  );

  const byStatus = useMemo(
    () =>
      STATUSES.map((s) => ({
        name: statusLabel(s.value),
        value: complaints.filter((x) => x.status === s.value).length,
      })).filter((r) => r.value > 0),
    [complaints],
  );

  const byDepartment = useMemo(
    () =>
      departments.map((d) => ({
        name: d.name.replace(" Department", ""),
        open: complaints.filter(
          (c) => c.department_id === d.id && c.status !== "resolved" && c.status !== "rejected",
        ).length,
        resolved: complaints.filter((c) => c.department_id === d.id && c.status === "resolved")
          .length,
      })),
    [complaints, departments],
  );

  const monthly = useMemo(() => {
    const map = new Map<string, { name: string; reported: number; resolved: number }>();
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i, 1);
      const key = `${d.getFullYear()}-${d.getMonth()}`;
      map.set(key, {
        name: d.toLocaleDateString("en-IN", { month: "short" }),
        reported: 0,
        resolved: 0,
      });
    }
    for (const c of complaints) {
      const d = new Date(c.created_at);
      const row = map.get(`${d.getFullYear()}-${d.getMonth()}`);
      if (row) row.reported += 1;
      if (c.resolved_at) {
        const r = new Date(c.resolved_at);
        const rrow = map.get(`${r.getFullYear()}-${r.getMonth()}`);
        if (rrow) rrow.resolved += 1;
      }
    }
    return [...map.values()];
  }, [complaints]);

  const avgResolutionDays = useMemo(() => {
    const done = complaints.filter((c) => c.resolved_at);
    if (done.length === 0) return "—";
    const total = done.reduce(
      (sum, c) =>
        sum + (new Date(c.resolved_at!).getTime() - new Date(c.created_at).getTime()) / 86400000,
      0,
    );
    return `${(total / done.length).toFixed(1)} days`;
  }, [complaints]);

  const resolutionRate =
    complaints.length === 0
      ? "—"
      : `${Math.round((complaints.filter((c) => c.status === "resolved").length / complaints.length) * 100)}%`;

  if (isLoading) return <p className="text-sm text-muted-foreground">Loading analytics…</p>;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border bg-card p-5 shadow-card">
          <p className="text-sm text-muted-foreground">Total complaints</p>
          <p className="font-display text-3xl font-semibold">{complaints.length}</p>
        </div>
        <div className="rounded-xl border bg-card p-5 shadow-card">
          <p className="text-sm text-muted-foreground">Resolution rate</p>
          <p className="font-display text-3xl font-semibold">{resolutionRate}</p>
        </div>
        <div className="rounded-xl border bg-card p-5 shadow-card">
          <p className="text-sm text-muted-foreground">Average time to resolve</p>
          <p className="font-display text-3xl font-semibold">{avgResolutionDays}</p>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <ChartCard title="Complaints by category">
          <BarChart data={byCategory} margin={{ left: -20, bottom: 40 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="name" angle={-30} textAnchor="end" interval={0} fontSize={11} />
            <YAxis allowDecimals={false} fontSize={11} />
            <Tooltip />
            <Bar dataKey="count" fill="#0f766e" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ChartCard>

        <ChartCard title="Status breakdown">
          <PieChart>
            <Pie data={byStatus} dataKey="value" nameKey="name" outerRadius={110} label>
              {byStatus.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ChartCard>

        <ChartCard title="Department workload">
          <BarChart data={byDepartment} margin={{ left: -20, bottom: 30 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="name" angle={-20} textAnchor="end" interval={0} fontSize={11} />
            <YAxis allowDecimals={false} fontSize={11} />
            <Tooltip />
            <Legend />
            <Bar dataKey="open" stackId="a" fill="#f59e0b" />
            <Bar dataKey="resolved" stackId="a" fill="#0f766e" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ChartCard>

        <ChartCard title="Reported vs resolved (last 6 months)">
          <LineChart data={monthly} margin={{ left: -20 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="name" fontSize={11} />
            <YAxis allowDecimals={false} fontSize={11} />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="reported" stroke="#2563eb" strokeWidth={2} />
            <Line type="monotone" dataKey="resolved" stroke="#0f766e" strokeWidth={2} />
          </LineChart>
        </ChartCard>
      </div>
    </div>
  );
}

function ChartCard({ title, children }: { title: string; children: React.ReactElement }) {
  return (
    <div className="rounded-xl border bg-card p-5 shadow-card">
      <h3 className="mb-4 font-medium">{title}</h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          {children}
        </ResponsiveContainer>
      </div>
    </div>
  );
}
