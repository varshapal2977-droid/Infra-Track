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
import {
  Activity,
  BarChart3,
  CheckCircle2,
  Clock,
  Layers,
  TrendingUp,
} from "lucide-react";
import { RequireAuth } from "@/components/RequireAuth";
import { AppShell } from "@/components/AppShell";
import { StatCard } from "@/components/StatCard";
import { fetchComplaints, fetchDepartments } from "@/lib/complaints";
import { CATEGORIES, STATUSES, categoryLabel, statusLabel } from "@/lib/infratrack";

export const Route = createFileRoute("/admin/analytics")({
  head: () => ({
    meta: [
      { title: "Municipal Analytics & Performance — InfraTrack" },
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

const CIVIC_COLORS = [
  "#5D866C", // Primary Sage green (Stripe 1)
  "#C2A68C", // Warm Taupe / Sandstone (Stripe 2)
  "#4E8764", // Botanical emerald
  "#C28A4A", // Warm Ochre
  "#537B88", // River Slate Blue
  "#C85344", // Terracotta
  "#78A388", // Soft Moss
  "#8E7D6B", // Warm Umber
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

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center rounded-2xl border bg-card shadow-card">
        <p className="text-sm font-medium text-muted-foreground">Aggregating city metrics...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Analytics KPI Header */}
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          label="Total Grievances"
          value={complaints.length}
          icon={Activity}
          hint="Across all 18 urban wards"
        />
        <StatCard
          label="City Resolution Rate"
          value={resolutionRate}
          icon={CheckCircle2}
          tone="success"
          hint="Complaints closed and verified"
        />
        <StatCard
          label="Average Turnaround"
          value={avgResolutionDays}
          icon={Clock}
          tone="info"
          hint="From report submission to resolution"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid gap-6 xl:grid-cols-2">
        <ChartCard title="Complaints by Category" subtitle="Volume breakdown across infrastructure types">
          <BarChart data={byCategory} margin={{ left: -15, bottom: 45, top: 10 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(148, 163, 184, 0.2)" />
            <XAxis dataKey="name" angle={-25} textAnchor="end" interval={0} fontSize={11} stroke="currentColor" />
            <YAxis allowDecimals={false} fontSize={11} stroke="currentColor" />
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--card)",
                borderColor: "var(--border)",
                borderRadius: "0.75rem",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                fontSize: "12px",
              }}
            />
            <Bar dataKey="count" fill="#0d9488" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ChartCard>

        <ChartCard title="Status Breakdown" subtitle="Current status distribution of tickets">
          <PieChart>
            <Pie
              data={byStatus}
              dataKey="value"
              nameKey="name"
              outerRadius={105}
              innerRadius={50}
              paddingAngle={3}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              labelLine={false}
              fontSize={11}
            >
              {byStatus.map((_, i) => (
                <Cell key={i} fill={CIVIC_COLORS[i % CIVIC_COLORS.length]} strokeWidth={2} stroke="var(--card)" />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--card)",
                borderColor: "var(--border)",
                borderRadius: "0.75rem",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                fontSize: "12px",
              }}
            />
            <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "10px" }} />
          </PieChart>
        </ChartCard>

        <ChartCard title="Department Workload" subtitle="Active backlog vs resolved work orders">
          <BarChart data={byDepartment} margin={{ left: -15, bottom: 35, top: 10 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(148, 163, 184, 0.2)" />
            <XAxis dataKey="name" angle={-15} textAnchor="end" interval={0} fontSize={11} stroke="currentColor" />
            <YAxis allowDecimals={false} fontSize={11} stroke="currentColor" />
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--card)",
                borderColor: "var(--border)",
                borderRadius: "0.75rem",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                fontSize: "12px",
              }}
            />
            <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "10px" }} />
            <Bar dataKey="open" name="Active Backlog" stackId="a" fill="#f59e0b" />
            <Bar dataKey="resolved" name="Resolved" stackId="a" fill="#0d9488" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ChartCard>

        <ChartCard title="Reported vs. Resolved (Last 6 Months)" subtitle="Monthly intake pace versus field completions">
          <LineChart data={monthly} margin={{ left: -15, top: 10 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(148, 163, 184, 0.2)" />
            <XAxis dataKey="name" fontSize={11} stroke="currentColor" />
            <YAxis allowDecimals={false} fontSize={11} stroke="currentColor" />
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--card)",
                borderColor: "var(--border)",
                borderRadius: "0.75rem",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                fontSize: "12px",
              }}
            />
            <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "10px" }} />
            <Line
              type="monotone"
              dataKey="reported"
              name="Incoming Reports"
              stroke="#2563eb"
              strokeWidth={2.5}
              dot={{ r: 4 }}
            />
            <Line
              type="monotone"
              dataKey="resolved"
              name="Verified Resolved"
              stroke="#0d9488"
              strokeWidth={2.5}
              dot={{ r: 4 }}
            />
          </LineChart>
        </ChartCard>
      </div>
    </div>
  );
}

function ChartCard({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactElement;
}) {
  return (
    <div className="rounded-2xl border border-border/80 bg-card p-6 shadow-card space-y-4">
      <div>
        <h3 className="font-display text-base font-bold text-foreground">{title}</h3>
        {subtitle ? <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p> : null}
      </div>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          {children}
        </ResponsiveContainer>
      </div>
    </div>
  );
}
