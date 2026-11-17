import { useMemo, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  Activity,
  AlertCircle,
  ArrowRight,
  BarChart3,
  Calendar,
  CheckCircle2,
  Clock,
  Compass,
  ExternalLink,
  FilePlus2,
  FileText,
  Filter,
  HardHat,
  History,
  Layers,
  Loader2,
  MapPin,
  PieChart as PieChartIcon,
  PlusCircle,
  Search,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  X,
  XCircle,
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { RequireAuth } from "@/components/RequireAuth";
import { AppShell } from "@/components/AppShell";
import { StatCard } from "@/components/StatCard";
import { StatusBadge, PriorityBadge } from "@/components/Badges";
import { UserAvatar } from "@/components/UserAvatar";
import { MapPanel } from "@/components/MapPanel";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/context/LanguageContext";
import { fetchComplaints } from "@/lib/complaints";
import { supabase } from "@/integrations/supabase/client";
import { categoryLabel, formatDate, formatDateTime, statusLabel } from "@/lib/infratrack";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Citizen Dashboard — InfraTrack" },
      { name: "description", content: "Your personal civic infrastructure resolution center and complaint tracking dashboard." },
      { property: "og:title", content: "Citizen Dashboard — InfraTrack" },
      { property: "og:description", content: "Track filed civic complaints, monitor repairs, and view personal resolution statistics." },
    ],
  }),
  component: () => (
    <RequireAuth>
      <DashboardPage />
    </RequireAuth>
  ),
});

function DashboardPage() {
  const { user, profile, isAdmin } = useAuth();
  const { t, language } = useLanguage();
  const navigate = useNavigate();

  // Status Filter State for Recent Complaints
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Track Complaint Modal State
  const [trackOpen, setTrackOpen] = useState(false);
  const [trackInput, setTrackInput] = useState("");

  // 1. Fetch user's actual complaints from Supabase
  const { data: mine = [], isLoading: loadingComplaints } = useQuery({
    queryKey: ["complaints", "mine", user?.id],
    queryFn: () => fetchComplaints({ userId: user!.id }),
    enabled: !!user,
  });

  // 2. Fetch user's complaints recent status history
  const complaintIds = useMemo(() => mine.map((c) => c.id), [mine]);
  const { data: recentActivity = [], isLoading: loadingActivity } = useQuery({
    queryKey: ["activity", "mine", user?.id, complaintIds.join(",")],
    queryFn: async () => {
      if (!complaintIds.length) return [];
      const { data, error } = await supabase
        .from("status_history")
        .select("id, complaint_id, old_status, new_status, remarks, changed_at")
        .in("complaint_id", complaintIds)
        .order("changed_at", { ascending: false })
        .limit(8);

      if (error || !data) return [];
      return data.map((hist) => {
        const comp = mine.find((c) => c.id === hist.complaint_id);
        return {
          ...hist,
          complaintTitle: comp?.title || t("brand.name", "Civic Complaint"),
          complaintCode: comp?.complaint_id || "",
          category: comp?.category || "other",
        };
      });
    },
    enabled: !!user && complaintIds.length > 0,
  });

  // Dynamic Statistics
  const total = mine.length;
  const pending = mine.filter((c) => c.status === "pending").length;
  const inProgress = mine.filter((c) => c.status === "assigned" || c.status === "in_progress").length;
  const resolved = mine.filter((c) => c.status === "resolved").length;
  const rejected = mine.filter((c) => c.status === "rejected").length;
  const resolutionRate = total > 0 ? Math.round((resolved / total) * 100) : 0;

  // Monthly Activity Trend for Analytics
  const monthlyActivityData = useMemo(() => {
    if (!mine.length) return [];
    const map: Record<string, { monthKey: string; name: string; total: number; resolved: number }> = {};

    mine.forEach((c) => {
      const d = new Date(c.created_at);
      const monthKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      const name = d.toLocaleDateString(language === "hi" ? "hi-IN" : "en-IN", {
        month: "short",
        year: "2-digit",
      });

      if (!map[monthKey]) {
        map[monthKey] = { monthKey, name, total: 0, resolved: 0 };
      }
      map[monthKey].total += 1;
      if (c.status === "resolved") {
        map[monthKey].resolved += 1;
      }
    });

    return Object.keys(map)
      .sort()
      .map((k) => map[k]);
  }, [mine, language]);

  // Status Distribution Data for Donut Chart
  const statusDistribution = useMemo(() => {
    const list = [
      { name: t("status.pending", "Pending"), count: pending, color: "#C28A4A" }, // Warm ochre
      { name: t("status.in_progress", "In Progress"), count: inProgress, color: "#3F7954" }, // Accent botanical green
      { name: t("status.resolved", "Resolved"), count: resolved, color: "#285B40" }, // Secondary forest green
      { name: t("status.rejected", "Rejected"), count: rejected, color: "#C85344" }, // Terracotta
    ];
    return list.filter((item) => item.count > 0);
  }, [pending, inProgress, resolved, rejected, t]);

  // Filtered Complaints List
  const filteredComplaints = useMemo(() => {
    return mine.filter((c) => {
      const matchesStatus =
        statusFilter === "all"
          ? true
          : statusFilter === "in_progress"
            ? c.status === "assigned" || c.status === "in_progress"
            : c.status === statusFilter;

      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        c.complaint_id.toLowerCase().includes(q) ||
        c.title.toLowerCase().includes(q) ||
        (c.address && c.address.toLowerCase().includes(q)) ||
        (c.area && c.area.toLowerCase().includes(q));

      return matchesStatus && matchesSearch;
    });
  }, [mine, statusFilter, searchQuery]);

  function handleTrackSubmit(e: React.FormEvent) {
    e.preventDefault();
    const clean = trackInput.trim();
    if (!clean) {
      toast.error(t("track.empty_error", "Please enter a complaint ID."));
      return;
    }

    const found = mine.find(
      (c) =>
        c.complaint_id.toLowerCase() === clean.toLowerCase() ||
        c.id.toLowerCase() === clean.toLowerCase(),
    );

    if (found) {
      setTrackOpen(false);
      navigate({ to: "/complaints/$id", params: { id: found.id } });
    } else {
      // Query global complaint if not in user's direct list
      supabase
        .from("complaints")
        .select("id")
        .or(`complaint_id.ilike.${clean},id.eq.${clean}`)
        .maybeSingle()
        .then(({ data }) => {
          if (data?.id) {
            setTrackOpen(false);
            navigate({ to: "/complaints/$id", params: { id: data.id } });
          } else {
            toast.error(t("track.not_found", "Complaint ID not found. Opening the city map."));
            setTrackOpen(false);
            navigate({ to: "/map" });
          }
        });
    }
  }

  const displayName = profile?.full_name ? profile.full_name : t("role.resident", "Citizen");

  return (
    <AppShell title={t("dashboard.title", "Citizen Dashboard")} fullWidth>
      <div className="space-y-8 pb-10">
        {/* ======================================================== */}
        {/* 1. WELCOME HEADER                                        */}
        {/* ======================================================== */}
        <section className="relative overflow-hidden rounded-3xl border border-border/80 bg-card p-6 shadow-card transition-all md:p-8">
          {/* Subtle civic botanical mesh gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent pointer-events-none" />
          <div className="absolute inset-0 surface-grid opacity-30 pointer-events-none" />

          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            {/* Left: Avatar & Greeting */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 max-w-3xl">
              <Link to="/profile" className="shrink-0 group relative" title={t("nav.profile", "Manage Profile Photo")}>
                <UserAvatar
                  src={profile?.avatar_url}
                  name={profile?.full_name}
                  size="2xl"
                  ring
                  className="h-20 w-20 sm:h-24 sm:w-24 shadow-sm transition-transform duration-200 group-hover:scale-105"
                />
                <span className="absolute bottom-0 right-0 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground border-2 border-card shadow-2xs">
                  <Sparkles className="h-3 w-3" />
                </span>
              </Link>

              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/25 bg-primary/10 px-3 py-0.5 text-xs font-bold text-primary tracking-wide">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    {t("dashboard.hub_badge", "Citizen Grievance Hub")}
                  </span>
                  <span className="rounded-full bg-muted/80 px-2.5 py-0.5 text-[11px] font-medium text-muted-foreground">
                    {t("status.wards_active", "Wards Active & Connected")}
                  </span>
                </div>

                <h1 className="font-display text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl lg:text-4xl">
                  {t("dashboard.welcome", "Welcome back")},{" "}
                  <span className="text-primary">{displayName}</span>
                </h1>

                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-2xl">
                  {t(
                    "dashboard.welcome_desc",
                    "Monitor active public work orders, track resolution milestones live, and verify municipal field repairs across city wards.",
                  )}
                </p>
              </div>
            </div>

            {/* Right: Primary CTAs */}
            <div className="flex flex-wrap items-center gap-3 shrink-0 pt-2 lg:pt-0">
              <Link to="/report">
                <Button size="lg" className="gap-2 font-semibold shadow-xs text-sm sm:text-base">
                  <PlusCircle className="h-5 w-5" />
                  {t("dashboard.report_button", "Report New Issue")}
                </Button>
              </Link>

              <Button
                variant="outline"
                size="lg"
                onClick={() => setTrackOpen(true)}
                className="gap-2 font-medium text-sm sm:text-base"
              >
                <Search className="h-4.5 w-4.5 text-primary" />
                {t("actions.track_complaint", "Track a Complaint")}
              </Button>
            </div>
          </div>
        </section>

        {/* ======================================================== */}
        {/* 2. DYNAMIC STATISTICS CARDS (KPIs)                       */}
        {/* ======================================================== */}
        <section aria-label="Complaint Statistics" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            label={t("stats.total", "Total Complaints")}
            value={total}
            icon={FileText}
            tone="default"
            hint={t("stats.total_hint", "Lifetime grievances filed")}
          />

          <StatCard
            label={t("stats.pending", "Pending Complaints")}
            value={pending}
            icon={Clock}
            tone="accent"
            hint={t("stats.pending_hint", "Awaiting department triage")}
          />

          <StatCard
            label={t("stats.in_progress", "In Progress")}
            value={inProgress}
            icon={HardHat}
            tone="info"
            hint={t("stats.in_progress_hint", "Crews dispatched to site")}
          />

          <StatCard
            label={t("stats.resolved", "Resolved Complaints")}
            value={resolved}
            icon={CheckCircle2}
            tone="success"
            hint={
              total > 0
                ? `${resolutionRate}% ${t("stats.resolution_rate", "Resolution Rate")}`
                : t("stats.resolved_hint", "Inspected & confirmed")
            }
          />
        </section>

        {/* ======================================================== */}
        {/* 3. COMPLAINT ANALYTICS (Activity Trend & Status Donut)   */}
        {/* ======================================================== */}
        <section className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h2 className="font-display text-xl font-bold tracking-tight text-foreground sm:text-2xl">
                {t("analytics.title", "Complaint Analytics")}
              </h2>
              <p className="text-xs text-muted-foreground sm:text-sm">
                {t("analytics.subtitle", "Visual insights into your filed grievances and resolution patterns")}
              </p>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-12 items-stretch">
            {/* Chart 1: Monthly Filing & Resolution Trend */}
            <div className="rounded-2xl border border-border/80 bg-card p-6 shadow-card lg:col-span-7 flex flex-col justify-between">
              <div className="flex items-center justify-between pb-4 border-b border-border/60">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <TrendingUp className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="font-display text-sm font-bold text-foreground sm:text-base">
                      {t("analytics.activity_trend", "Filing Activity Over Time")}
                    </h3>
                    <p className="text-[11px] text-muted-foreground">
                      {total} {t("analytics.complaints_count", "Complaints")} {t("stats.total_hint", "recorded")}
                    </p>
                  </div>
                </div>

                <span className="rounded-md bg-muted px-2 py-1 text-xs font-medium text-muted-foreground">
                  {monthlyActivityData.length} {language === "hi" ? "महीने" : "months"}
                </span>
              </div>

              {loadingComplaints ? (
                <div className="h-64 flex flex-col items-center justify-center text-muted-foreground">
                  <Loader2 className="h-6 w-6 animate-spin text-primary mb-2" />
                  <p className="text-xs">{t("common.loading", "Loading analytics...")}</p>
                </div>
              ) : monthlyActivityData.length === 0 ? (
                <div className="h-64 flex flex-col items-center justify-center text-center p-6 space-y-2">
                  <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
                    <BarChart3 className="h-5 w-5" />
                  </div>
                  <p className="font-semibold text-sm text-foreground">
                    {t("analytics.no_data", "Not enough complaint data yet to chart")}
                  </p>
                  <p className="text-xs text-muted-foreground max-w-sm">
                    {t(
                      "analytics.no_data_desc",
                      "Once you submit complaints, your monthly reporting activity and resolution trends will appear here.",
                    )}
                  </p>
                </div>
              ) : (
                <div className="pt-6 h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={monthlyActivityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="forestGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#163D2C" stopOpacity={0.4} />
                          <stop offset="95%" stopColor="#163D2C" stopOpacity={0.0} />
                        </linearGradient>
                        <linearGradient id="emeraldGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#285B40" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#285B40" stopOpacity={0.0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E5DC" opacity={0.7} />
                      <XAxis
                        dataKey="name"
                        tickLine={false}
                        axisLine={false}
                        tick={{ fontSize: 11, fill: "#657268" }}
                      />
                      <YAxis
                        allowDecimals={false}
                        tickLine={false}
                        axisLine={false}
                        tick={{ fontSize: 11, fill: "#657268" }}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#FFFFFF",
                          borderRadius: "12px",
                          border: "1px solid #E2E5DC",
                          boxShadow: "0 8px 24px -4px rgba(22, 61, 44, 0.12)",
                          fontSize: "12px",
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="total"
                        name={t("stats.total", "Total Filed")}
                        stroke="#163D2C"
                        strokeWidth={2.5}
                        fillOpacity={1}
                        fill="url(#forestGradient)"
                      />
                      <Area
                        type="monotone"
                        dataKey="resolved"
                        name={t("status.resolved", "Resolved")}
                        stroke="#4E8764"
                        strokeWidth={2}
                        fillOpacity={1}
                        fill="url(#emeraldGradient)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>

            {/* Chart 2: Status Distribution Donut */}
            <div className="rounded-2xl border border-border/80 bg-card p-6 shadow-card lg:col-span-5 flex flex-col justify-between">
              <div className="flex items-center justify-between pb-4 border-b border-border/60">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/20 text-accent-foreground">
                    <PieChartIcon className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="font-display text-sm font-bold text-foreground sm:text-base">
                      {t("analytics.status_distribution", "Distribution by Status")}
                    </h3>
                    <p className="text-[11px] text-muted-foreground">
                      {total} {t("stats.total", "Grievances")}
                    </p>
                  </div>
                </div>

                <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-bold text-primary">
                  {resolutionRate}% {t("status.resolved", "Resolved")}
                </span>
              </div>

              {loadingComplaints ? (
                <div className="h-64 flex flex-col items-center justify-center text-muted-foreground">
                  <Loader2 className="h-6 w-6 animate-spin text-primary mb-2" />
                  <p className="text-xs">{t("common.loading", "Loading distribution...")}</p>
                </div>
              ) : statusDistribution.length === 0 ? (
                <div className="h-64 flex flex-col items-center justify-center text-center p-6 space-y-2">
                  <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
                    <Layers className="h-5 w-5" />
                  </div>
                  <p className="font-semibold text-sm text-foreground">
                    {t("complaints.first_time_title", "No complaints filed yet")}
                  </p>
                  <p className="text-xs text-muted-foreground max-w-xs">
                    {t(
                      "complaints.first_time_desc",
                      "Report an issue with roads, streetlights, drainage, or sanitation to watch repairs happen.",
                    )}
                  </p>
                </div>
              ) : (
                <div className="pt-2 flex flex-col sm:flex-row items-center justify-around gap-4 h-64">
                  <div className="h-44 w-44 relative">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={statusDistribution}
                          innerRadius={48}
                          outerRadius={68}
                          paddingAngle={3}
                          dataKey="count"
                        >
                          {statusDistribution.map((entry, idx) => (
                            <Cell key={`cell-${idx}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "#FFFFFF",
                            borderRadius: "10px",
                            border: "1px solid #E2E5DC",
                            fontSize: "12px",
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                      <span className="font-display text-xl font-black text-foreground">{total}</span>
                      <span className="text-[10px] uppercase font-bold text-muted-foreground">
                        {language === "hi" ? "कुल" : "Total"}
                      </span>
                    </div>
                  </div>

                  {/* Legend breakdown list */}
                  <div className="space-y-2 min-w-[140px]">
                    {statusDistribution.map((item) => (
                      <div key={item.name} className="flex items-center justify-between text-xs gap-3">
                        <div className="flex items-center gap-2">
                          <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                          <span className="text-muted-foreground font-medium">{item.name}</span>
                        </div>
                        <span className="font-mono font-bold text-foreground">{item.count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ======================================================== */}
        {/* 4 & 5 & 6. RECENT COMPLAINTS + ACTIVITY + QUICK ACTIONS  */}
        {/* ======================================================== */}
        <div className="grid gap-8 lg:grid-cols-12 items-start">
          {/* LEFT 8 COLS: Recent Complaints List with Status Filter & Search */}
          <div className="space-y-4 lg:col-span-8">
            <div className="rounded-2xl border border-border/80 bg-card shadow-card">
              {/* Header & Filter Controls */}
              <div className="border-b border-border/80 p-5 sm:p-6 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <h3 className="font-display text-lg font-bold text-foreground">
                      {t("complaints.recent_title", "Recent Complaints")}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {t("complaints.recent_subtitle", "Review and filter issues submitted from your account")}
                    </p>
                  </div>

                  <Link
                    to="/my-complaints"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
                  >
                    {t("complaints.view_all", "View All Complaints")} ({mine.length})
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>

                {/* Filter Pills + Search Input Bar */}
                <div className="flex flex-col md:flex-row gap-3 pt-2">
                  {/* Status Filter Tabs */}
                  <div className="flex flex-wrap items-center gap-1.5 bg-muted/50 p-1 rounded-xl border border-border/60">
                    {[
                      { key: "all", label: t("complaints.filter_all", "All"), count: total },
                      { key: "pending", label: t("complaints.filter_pending", "Pending"), count: pending },
                      { key: "in_progress", label: t("complaints.filter_in_progress", "In Progress"), count: inProgress },
                      { key: "resolved", label: t("complaints.filter_resolved", "Resolved"), count: resolved },
                      { key: "rejected", label: t("complaints.filter_rejected", "Rejected"), count: rejected },
                    ].map((tab) => {
                      const active = statusFilter === tab.key;
                      return (
                        <button
                          key={tab.key}
                          type="button"
                          onClick={() => setStatusFilter(tab.key)}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${active
                            ? "bg-card text-foreground shadow-2xs border border-border/80"
                            : "text-muted-foreground hover:text-foreground"
                            }`}
                        >
                          <span>{tab.label}</span>
                          <span
                            className={`rounded-full px-1.5 py-0.2 text-[10px] ${active ? "bg-primary text-primary-foreground font-bold" : "bg-muted text-muted-foreground"
                              }`}
                          >
                            {tab.count}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Search Input */}
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                    <Input
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder={t("complaints.search_placeholder", "Search by ID, title, or address...")}
                      className="pl-9 h-9 text-xs bg-muted/30"
                    />
                    {searchQuery && (
                      <button
                        type="button"
                        onClick={() => setSearchQuery("")}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Complaints Table/Cards */}
              {loadingComplaints ? (
                <div className="p-10 text-center text-muted-foreground space-y-2">
                  <Loader2 className="mx-auto h-6 w-6 animate-spin text-primary" />
                  <p className="text-xs">{t("complaints.loading", "Loading your complaints...")}</p>
                </div>
              ) : filteredComplaints.length === 0 ? (
                <div className="p-12 text-center space-y-3">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
                    <FilePlus2 className="h-6 w-6 text-primary" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-display text-base font-bold text-foreground">
                      {searchQuery || statusFilter !== "all"
                        ? t("complaints.empty_title", "No complaints found in this view")
                        : t("complaints.first_time_title", "No complaints filed yet")}
                    </h4>
                    <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                      {searchQuery || statusFilter !== "all"
                        ? t("complaints.empty_desc", "You have not submitted any complaints matching this filter.")
                        : t(
                          "complaints.first_time_desc",
                          "Report an issue with roads, streetlights, drainage, or sanitation to watch repairs happen.",
                        )}
                    </p>
                  </div>
                  {total === 0 && (
                    <div className="pt-2">
                      <Link to="/report">
                        <Button size="sm" className="gap-1.5 font-semibold shadow-xs">
                          <PlusCircle className="h-4 w-4" /> {t("actions.report_issue", "Report a New Issue")}
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
              ) : (
                <ul className="divide-y divide-border/60">
                  {filteredComplaints.slice(0, 7).map((c) => (
                    <li
                      key={c.id}
                      className="group flex flex-col gap-3.5 p-4 sm:p-5 transition-colors hover:bg-muted/30 sm:flex-row sm:items-center sm:justify-between"
                    >
                      {/* Left: Info */}
                      <div className="min-w-0 flex-1 space-y-1.5">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-mono text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-md">
                            {c.complaint_id}
                          </span>
                          <span className="rounded bg-muted px-2 py-0.5 text-[11px] font-semibold text-muted-foreground">
                            {categoryLabel(c.category)}
                          </span>
                          <span className="text-xs text-muted-foreground">·</span>
                          <span className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            {formatDate(c.created_at)}
                          </span>
                        </div>

                        <Link
                          to="/complaints/$id"
                          params={{ id: c.id }}
                          className="font-display text-sm sm:text-base font-bold text-foreground group-hover:text-primary transition-colors line-clamp-1 block"
                        >
                          {c.title}
                        </Link>

                        <p className="flex items-center gap-1.5 text-xs text-muted-foreground truncate">
                          <MapPin className="h-3.5 w-3.5 text-primary shrink-0" />
                          <span className="truncate">{c.area || c.address}</span>
                        </p>
                      </div>

                      {/* Right: Badges & View Details CTA */}
                      <div className="flex items-center gap-2.5 self-start sm:self-center shrink-0">
                        <PriorityBadge priority={c.priority} />
                        <StatusBadge status={c.status} />

                        <Link to="/complaints/$id" params={{ id: c.id }}>
                          <Button
                            variant="outline"
                            size="sm"
                            className="gap-1.5 text-xs font-semibold hover:border-primary hover:text-primary transition-colors"
                          >
                            <span>{t("complaints.view_details", "View Details")}</span>
                            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                          </Button>
                        </Link>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Interactive City Map Overview */}
            {mine.length > 0 && (
              <div className="rounded-2xl border border-border/80 bg-card p-5 shadow-card space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-display text-base font-bold text-foreground">
                      {t("actions.city_map", "Explore Live Map")}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {t("actions.city_map_desc", "Inspect open and resolved civic issues across wards")}
                    </p>
                  </div>
                  <Link to="/map">
                    <Button variant="ghost" size="sm" className="gap-1 text-xs text-primary font-semibold">
                      {t("dashboard.explore_map", "Full Screen Map")} <ExternalLink className="h-3.5 w-3.5" />
                    </Button>
                  </Link>
                </div>
                <MapPanel complaints={mine} height="360px" />
              </div>
            )}
          </div>

          {/* RIGHT 4 COLS: Quick Actions & Recent Activity */}
          <div className="space-y-6 lg:col-span-4">
            {/* ======================================================== */}
            {/* 6. QUICK ACTIONS                                         */}
            {/* ======================================================== */}
            <div className="rounded-2xl border border-border/80 bg-card p-5 sm:p-6 shadow-card space-y-4">
              <div className="flex items-center justify-between border-b border-border/60 pb-3">
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Sparkles className="h-4 w-4" />
                  </div>
                  <h3 className="font-display text-base font-bold text-foreground">
                    {t("actions.title", "Quick Actions")}
                  </h3>
                </div>
              </div>

              <div className="space-y-2.5">
                {/* Action 1: Report Issue */}
                <Link
                  to="/report"
                  className="group flex items-start gap-3.5 rounded-xl border border-border/80 bg-muted/30 p-3.5 transition-all hover:border-primary/50 hover:bg-primary/5 hover:shadow-2xs"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground transition-transform group-hover:scale-105">
                    <PlusCircle className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="font-display text-xs sm:text-sm font-bold text-foreground group-hover:text-primary transition-colors">
                      {t("actions.report_issue", "Report a New Issue")}
                    </h4>
                    <p className="text-[11px] text-muted-foreground leading-snug mt-0.5">
                      {t("actions.report_desc", "Pinpoint a pothole, broken lamp, or leak on the map")}
                    </p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-transform group-hover:translate-x-1 shrink-0 self-center" />
                </Link>

                {/* Action 2: Track Complaint */}
                <button
                  type="button"
                  onClick={() => setTrackOpen(true)}
                  className="w-full text-left group flex items-start gap-3.5 rounded-xl border border-border/80 bg-muted/30 p-3.5 transition-all hover:border-primary/50 hover:bg-primary/5 hover:shadow-2xs cursor-pointer"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent text-accent-foreground transition-transform group-hover:scale-105 font-bold">
                    <Search className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="font-display text-xs sm:text-sm font-bold text-foreground group-hover:text-primary transition-colors">
                      {t("actions.track_complaint", "Track a Complaint")}
                    </h4>
                    <p className="text-[11px] text-muted-foreground leading-snug mt-0.5">
                      {t("actions.track_desc", "Look up any municipal ticket by ID")}
                    </p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-transform group-hover:translate-x-1 shrink-0 self-center" />
                </button>

                {/* Action 3: View All Complaints */}
                <Link
                  to="/my-complaints"
                  className="group flex items-start gap-3.5 rounded-xl border border-border/80 bg-muted/30 p-3.5 transition-all hover:border-primary/50 hover:bg-primary/5 hover:shadow-2xs"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-secondary text-secondary-foreground transition-transform group-hover:scale-105 font-bold">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="font-display text-xs sm:text-sm font-bold text-foreground group-hover:text-primary transition-colors">
                      {t("actions.view_all", "View All Complaints")}
                    </h4>
                    <p className="text-[11px] text-muted-foreground leading-snug mt-0.5">
                      {t("actions.view_all_desc", "Search and export your complete complaint history")}
                    </p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-transform group-hover:translate-x-1 shrink-0 self-center" />
                </Link>
              </div>
            </div>

            {/* ======================================================== */}
            {/* 5. RECENT ACTIVITY (Real Status Updates & Timeline)      */}
            {/* ======================================================== */}
            <div className="rounded-2xl border border-border/80 bg-card p-5 sm:p-6 shadow-card space-y-4">
              <div className="flex items-center justify-between border-b border-border/60 pb-3">
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-info/10 text-info">
                    <History className="h-4 w-4" />
                  </div>
                  <h3 className="font-display text-base font-bold text-foreground">
                    {t("activity.title", "Recent Activity & Updates")}
                  </h3>
                </div>
                <span className="text-[11px] text-muted-foreground font-mono">
                  {recentActivity.length} {language === "hi" ? "लॉग" : "logs"}
                </span>
              </div>

              {loadingActivity ? (
                <div className="p-8 text-center text-muted-foreground space-y-2">
                  <Loader2 className="mx-auto h-5 w-5 animate-spin text-primary" />
                  <p className="text-xs">{t("common.loading", "Loading activity logs...")}</p>
                </div>
              ) : recentActivity.length === 0 ? (
                <div className="p-8 text-center space-y-2">
                  <Clock className="mx-auto h-8 w-8 text-muted-foreground/60" />
                  <p className="text-xs font-semibold text-foreground">
                    {t("activity.empty", "No recent updates")}
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    {t(
                      "activity.empty_desc",
                      "Status updates and field inspection remarks will be listed here as municipal crews work on your tickets.",
                    )}
                  </p>
                </div>
              ) : (
                <div className="relative pl-4 space-y-4 border-l-2 border-border/80 ml-2">
                  {recentActivity.map((act) => (
                    <div key={act.id} className="relative group space-y-1">
                      {/* Timeline dot */}
                      <span className="absolute -left-[23px] top-1.5 h-3 w-3 rounded-full border-2 border-card bg-primary ring-2 ring-primary/20" />

                      <div className="flex items-center justify-between gap-2">
                        <Link
                          to="/complaints/$id"
                          params={{ id: act.complaint_id }}
                          className="font-mono text-[11px] font-bold text-primary hover:underline truncate max-w-[150px]"
                        >
                          {act.complaintCode || t("activity.ticket", "Ticket")}
                        </Link>
                        <span className="text-[10px] text-muted-foreground">
                          {formatDateTime(act.changed_at)}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <span className="text-xs text-muted-foreground">
                          {t("activity.status_changed", "Status updated to")}
                        </span>
                        <StatusBadge status={act.new_status} />
                      </div>

                      {act.remarks && (
                        <p className="text-xs text-foreground/80 bg-muted/40 p-2 rounded-lg leading-relaxed">
                          "{act.remarks}"
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* QUICK TRACK MODAL DIALOG                                 */}
      {/* ======================================================== */}
      {trackOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/40 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-md rounded-2xl border border-border/80 bg-card p-6 shadow-2xl space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-2">
                <Search className="h-5 w-5 text-primary" />
                <h3 className="font-display text-base font-bold text-foreground">
                  {t("track.dialog_title", "Track Infrastructure Grievance")}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setTrackOpen(false)}
                className="rounded-lg p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <p className="text-xs text-muted-foreground leading-relaxed">
              {t(
                "track.dialog_desc",
                "Enter a Complaint ID (e.g. INFRA-1024) to inspect its live status, assignment, and resolution proofs.",
              )}
            </p>

            <form onSubmit={handleTrackSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <Input
                  value={trackInput}
                  onChange={(e) => setTrackInput(e.target.value)}
                  placeholder={t("track.input_placeholder", "e.g. INFRA-2026-8419")}
                  className="font-mono text-sm h-10"
                  autoFocus
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setTrackOpen(false)}
                >
                  {t("action.cancel", "Cancel")}
                </Button>
                <Button type="submit" size="sm" className="gap-1.5 font-semibold">
                  <Search className="h-3.5 w-3.5" />
                  {t("track.button", "Track Ticket")}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AppShell>
  );
}
