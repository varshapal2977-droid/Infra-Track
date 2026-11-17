import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  AlertCircle,
  ArrowRight,
  BarChart3,
  CheckCircle2,
  Clock,
  Compass,
  Droplets,
  HardHat,
  Lightbulb,
  MapPin,
  PhoneCall,
  PlusCircle,
  Search,
  ShieldCheck,
  Sparkles,
  Trash2,
  Truck,
  Users2,
  Workflow,
  Wrench,
} from "lucide-react";
import { fetchComplaints } from "@/lib/complaints";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { StatusBadge, PriorityBadge } from "@/components/Badges";
import { UserAvatar } from "@/components/UserAvatar";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { useLanguage } from "@/context/LanguageContext";
import { categoryLabel, formatDate } from "@/lib/infratrack";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "InfraTrack | Civic Grievance & Resolution Portal" },
      {
        name: "description",
        content:
          "Official public platform to report, track, and resolve municipal infrastructure issues across city roads, streetlights, sanitation, and water systems.",
      },
      { property: "og:title", content: "InfraTrack | Civic Grievance & Resolution Portal" },
      {
        property: "og:description",
        content: "Empowering citizens to report civic infrastructure issues and track live municipal resolutions.",
      },
    ],
  }),
  component: Landing,
});

export function Landing() {
  const { user, profile, isAdmin } = useAuth();
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const [lookupId, setLookupId] = useState("");

  const { data: complaints = [] } = useQuery({
    queryKey: ["complaints", "public"],
    queryFn: () => fetchComplaints(),
  });

  const resolved = complaints.filter((c) => c.status === "resolved").length;
  const inProgress = complaints.filter(
    (c) => c.status === "assigned" || c.status === "in_progress",
  ).length;
  const pending = complaints.filter((c) => c.status === "pending").length;
  const resolutionRate =
    complaints.length > 0 ? Math.round((resolved / complaints.length) * 100) : 92;

  const recentComplaints = complaints.slice(0, 4);

  function handleLookup(e: React.FormEvent) {
    e.preventDefault();
    if (!lookupId.trim()) return;
    const cleanId = lookupId.trim();
    const found = complaints.find(
      (c) =>
        c.complaint_id.toLowerCase() === cleanId.toLowerCase() ||
        c.id.toLowerCase() === cleanId.toLowerCase(),
    );
    if (found) {
      navigate({ to: "/complaints/$id", params: { id: found.id } });
    } else {
      navigate({ to: "/map" });
    }
  }

  const CIVIC_CATEGORIES = [
    {
      value: "road_pothole",
      name: language === "hi" ? "सड़क और गड्ढे" : "Roads & Potholes",
      desc: language === "hi" ? "गहरे गड्ढे, टूटा डामर, धंसी सड़कें और खतरनाक मोड़।" : "Craters, broken asphalt, cave-ins, and uneven road surfaces.",
      icon: Wrench,
      sla: language === "hi" ? "24–48 घंटे" : "24–48 hours",
    },
    {
      value: "streetlight",
      name: language === "hi" ? "स्ट्रीटलाइट और बिजली" : "Streetlights & Power",
      desc: language === "hi" ? "बंद लैम्पपोस्ट, झूलते नंगे बिजली तार और अंधेरे चौराहे।" : "Non-functional lamps, dangling electrical wires, dark intersections.",
      icon: Lightbulb,
      sla: language === "hi" ? "12–24 घंटे" : "12–24 hours",
    },
    {
      value: "drainage",
      name: language === "hi" ? "जल निकासी और नाली" : "Drainage & Flooding",
      desc: language === "hi" ? "अवरुद्ध वर्षा नाले, खुले मैनहोल और सीवेज बैकफ्लो।" : "Blocked storm water drains, open manholes, sewer backflows.",
      icon: Droplets,
      sla: language === "hi" ? "24–36 घंटे" : "24–36 hours",
    },
    {
      value: "garbage",
      name: language === "hi" ? "कचरा और स्वच्छता" : "Garbage & Sanitation",
      desc: language === "hi" ? "ओवरफ्लो कूड़ेदान, अनसुलझा कचरा और अस्वच्छ सार्वजनिक स्थल।" : "Overflowing dumpsters, uncollected organic waste, public littering.",
      icon: Trash2,
      sla: language === "hi" ? "12–18 घंटे" : "12–18 hours",
    },
    {
      value: "water_leakage",
      name: language === "hi" ? "पेयजल आपूर्ति रिसाव" : "Water Supply Leaks",
      desc: language === "hi" ? "फटी मुख्य पेयजल पाइपलाइन, वाल्व रिसाव और दूषित पानी।" : "Burst municipal supply mains, valve leaks, contaminated water.",
      icon: Droplets,
      sla: language === "hi" ? "6–12 घंटे" : "6–12 hours",
    },
    {
      value: "public_property",
      name: language === "hi" ? "सार्वजनिक निर्माण और पार्क" : "Public Works & Parks",
      desc: language === "hi" ? "टूटे बस शेल्टर, क्षतिग्रस्त फुटपाथ और उखड़े संकेत बोर्ड।" : "Broken bus shelters, damaged pavements, uprooted signboards.",
      icon: HardHat,
      sla: language === "hi" ? "48–72 घंटे" : "48–72 hours",
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-primary/20">
      {/* Top Municipal Navigation Bar — Full Viewport Width */}
      <header className="sticky top-0 z-40 border-b border-border bg-card/95 backdrop-blur-md">
        <div className="w-[95%] max-w-[1760px] mx-auto flex h-18 items-center justify-between px-2 sm:px-4">
          {/* Logo & Brand Identity */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm transition-transform duration-200 group-hover:scale-105">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display text-xl font-extrabold tracking-tight text-foreground">
                  {t("brand.name", "InfraTrack")}
                </span>
                <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-[11px] font-bold text-primary tracking-wide uppercase">
                  {t("brand.official", "Official")}
                </span>
              </div>
              <p className="hidden text-xs text-muted-foreground sm:block leading-none mt-0.5 font-medium">
                {t("brand.subtitle", "Civic Grievance & Resolution Portal")}
              </p>
            </div>
          </Link>

          {/* Center Navigation Links */}
          <nav className="hidden items-center gap-8 text-sm font-semibold md:flex">
            <Link to="/map" className="text-muted-foreground transition-colors hover:text-primary">
              {t("nav.city_map", "Live City Map")}
            </Link>
            <a href="#categories" className="text-muted-foreground transition-colors hover:text-primary">
              {t("nav.civic_services", "Civic Services")}
            </a>
            <a href="#how-it-works" className="text-muted-foreground transition-colors hover:text-primary">
              {t("nav.how_it_works", "How It Works")}
            </a>
            <a href="#live-feed" className="text-muted-foreground transition-colors hover:text-primary">
              {t("nav.recent_resolutions", "Recent Resolutions")}
            </a>
            <Link to="/about" className="text-muted-foreground transition-colors hover:text-primary">
              {t("nav.about_demo", "About & Demo")}
            </Link>
          </nav>

          {/* Right Navigation Actions */}
          <div className="flex items-center gap-3 sm:gap-4">
            <LanguageSwitcher size="sm" />

            {user ? (
              <div className="flex items-center gap-3">
                <Link to={isAdmin ? "/admin" : "/dashboard"}>
                  <Button size="sm" className="font-semibold shadow-xs px-4">
                    {t("nav.open_dashboard", "Open Dashboard →")}
                  </Button>
                </Link>
                <Link to="/profile" className="flex items-center group" title={t("nav.profile", "Account Profile")}>
                  <UserAvatar
                    src={profile?.avatar_url}
                    name={profile?.full_name}
                    size="sm"
                    ring
                    className="transition-transform group-hover:scale-105"
                  />
                </Link>
              </div>
            ) : (
              <>
                <Link to="/login" className="hidden sm:inline-flex">
                  <Button variant="ghost" size="sm" className="font-medium text-foreground/80 hover:text-foreground">
                    {t("nav.sign_in", "Sign in")}
                  </Button>
                </Link>
                <Link to="/report">
                  <Button size="sm" className="gap-2 font-semibold shadow-xs px-4">
                    <PlusCircle className="h-4 w-4" /> {t("nav.report", "Report Issue")}
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section — 94–96% Viewport Layout */}
      <section className="relative overflow-hidden border-b border-border/80 py-16 lg:py-24">
        {/* Authentic Indian Urban Aerial Drone Background Layer */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat pointer-events-none opacity-20 dark:opacity-10 mix-blend-multiply dark:mix-blend-luminosity transition-opacity duration-300"
          style={{
            backgroundImage: "url('/hero-aerial-bg.jpg')",
            maskImage:
              "linear-gradient(to bottom, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.7) 70%, rgba(0,0,0,0) 100%)",
            WebkitMaskImage:
              "linear-gradient(to bottom, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.7) 70%, rgba(0,0,0,0) 100%)",
          }}
          aria-hidden="true"
        />

        {/* Soft Radial and Directional Light Wash */}
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/85 to-transparent pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-b from-card/40 via-transparent to-background pointer-events-none" />
        <div className="absolute inset-0 surface-grid opacity-30 pointer-events-none" />

        <div className="relative w-[95%] max-w-[1760px] mx-auto px-2 sm:px-4">
          <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
            {/* Left Hero Column: 50–55% space */}
            <div className="lg:col-span-7 space-y-7">
              {/* Civic Operational Status Pill */}
              <div className="inline-flex items-center gap-2.5 rounded-full border border-primary/25 bg-primary/8 px-4 py-1.5 text-xs font-semibold text-primary shadow-2xs">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-primary" />
                </span>
                <span>{t("hero.badge_wards", "Active City Operations · 18 Wards Connected")}</span>
                <span className="text-primary/40 sm:inline">|</span>
                <span className="text-muted-foreground">{t("hero.badge_redressal", "24/7 Citizen Redressal")}</span>
              </div>

              {/* Main Powerful Headline */}
              <h1 className="font-display text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl text-foreground leading-[1.12]">
                {t("hero.title_part1", "Report City Issues.")} <br />
                <span className="text-primary">{t("hero.title_part2", "Watch Real Repairs Happen.")}</span>
              </h1>

              {/* Human-Centered Explanatory Subhead */}
              <p className="max-w-3xl text-base text-muted-foreground sm:text-lg leading-relaxed font-normal">
                {t("hero.subtitle", "Potholes, non-working streetlights, burst water pipelines, or overflowing waste — pinpoint the exact location on our live map, route directly to municipal field crews, and inspect verified status milestones until complete resolution.")}
              </p>

              {/* Primary Call-to-Actions with High-Contrast Deep Green */}
              <div className="flex flex-wrap items-center gap-4 pt-1">
                <Link to="/report">
                  <Button size="lg" className="gap-2.5 font-bold shadow-md text-base px-7 h-12 bg-primary hover:bg-primary/90 text-primary-foreground">
                    <PlusCircle className="h-5 w-5" /> {t("hero.report_btn", "Report an Infrastructure Issue")}
                  </Button>
                </Link>
                <Link to="/map">
                  <Button size="lg" variant="outline" className="gap-2 font-semibold text-base px-6 h-12 border-border hover:bg-card">
                    <Compass className="h-5 w-5 text-primary" /> {t("hero.explore_map", "Explore City Live Map")}
                  </Button>
                </Link>
              </div>

              {/* Prominent Wide Complaint Tracker Bar */}
              <div className="pt-2 max-w-xl">
                <form
                  onSubmit={handleLookup}
                  className="flex items-center gap-2 rounded-2xl border-2 border-border bg-card p-2 shadow-sm focus-within:ring-3 focus-within:ring-primary/20 focus-within:border-primary transition-all"
                >
                  <Search className="ml-3 h-5 w-5 text-muted-foreground shrink-0" />
                  <Input
                    value={lookupId}
                    onChange={(e) => setLookupId(e.target.value)}
                    placeholder={t("hero.lookup_placeholder", "Have a Complaint ID? (e.g. INFRA-1024)")}
                    className="border-0 shadow-none focus-visible:ring-0 text-sm h-10 bg-transparent placeholder:text-muted-foreground/75"
                  />
                  <Button type="submit" size="sm" className="shrink-0 font-bold px-5 h-10 bg-secondary hover:bg-secondary/90 text-secondary-foreground">
                    {t("hero.lookup_track", "Track")}
                  </Button>
                </form>
              </div>
            </div>

            {/* Right Hero Column: Enlarged Live Showcase Card (40–45% space) */}
            <div className="lg:col-span-5">
              <div className="relative mx-auto w-full max-w-xl rounded-3xl border border-border bg-card p-7 sm:p-8 shadow-card hover:shadow-card-hover transition-all duration-300">
                {/* Showcase Header */}
                <div className="flex items-center justify-between border-b pb-5">
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary font-bold text-sm">
                      PWD
                    </span>
                    <div>
                      <p className="font-mono text-sm font-bold text-foreground">INFRA-2026-8419</p>
                      <p className="text-xs text-muted-foreground font-medium">Ward 12 · Indiranagar Sector 2</p>
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-700 dark:text-emerald-400">
                    <CheckCircle2 className="h-3.5 w-3.5" /> {t("hero.preview_resolved_time", "Resolved in 18h")}
                  </span>
                </div>

                {/* Showcase Body */}
                <div className="py-5 space-y-4">
                  <div className="space-y-1.5">
                    <span className="text-[11px] font-bold text-primary uppercase tracking-wider">
                      {t("hero.preview_dept", "Roads & Highways Department")}
                    </span>
                    <h3 className="font-display text-lg font-bold text-foreground">
                      {t("hero.preview_title", "Deep road crater near Metro Station Gate 3")}
                    </h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {t("hero.preview_desc", "Vehicle axle damage hazard near main bus dropoff. Asphalt filling and steam roller compaction completed.")}
                    </p>
                  </div>

                  {/* Geotag Card Snippet */}
                  <div className="flex items-center gap-2.5 rounded-xl bg-muted/50 p-3 text-xs text-muted-foreground font-medium">
                    <MapPin className="h-4 w-4 text-primary shrink-0" />
                    <span className="truncate">{t("hero.preview_location", "100 Feet Road, Junction 4, Indiranagar")}</span>
                    <span className="ml-auto font-mono text-[11px] text-muted-foreground/80">12.9716°N</span>
                  </div>

                  {/* Micro Stepper Progression */}
                  <div className="space-y-2.5 pt-2 border-t">
                    <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                      {t("hero.preview_audit", "Live Resolution Audit")}
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-center gap-3 text-xs">
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-white text-[11px] font-bold">✓</span>
                        <span className="font-medium text-foreground">{t("hero.preview_step1", "Reported by Resident")}</span>
                        <span className="ml-auto font-mono text-[10px] text-muted-foreground">08:30 AM</span>
                      </div>
                      <div className="flex items-center gap-3 text-xs">
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-white text-[11px] font-bold">✓</span>
                        <span className="font-medium text-foreground">{t("hero.preview_step2", "Assigned to Asphalt Crew 4")}</span>
                        <span className="ml-auto font-mono text-[10px] text-muted-foreground">11:15 AM</span>
                      </div>
                      <div className="flex items-center gap-3 text-xs">
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-600 text-white text-[11px] font-bold">✓</span>
                        <span className="font-bold text-emerald-700 dark:text-emerald-400">{t("hero.preview_step3", "Pothole Filled & Inspected")}</span>
                        <span className="ml-auto font-mono text-[10px] text-emerald-600 font-bold uppercase">{t("status.resolved", "Resolved")}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Showcase Footer CTA */}
                <div className="border-t pt-4 flex items-center justify-between text-xs">
                  <span className="text-muted-foreground font-medium">{t("hero.preview_audited_by", "Audited by Municipal Council")}</span>
                  <Link to="/map" className="font-bold text-primary hover:underline flex items-center gap-1.5">
                    {t("hero.preview_view_map", "View on Live Map")} <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Strip (4 Key Civic Pillars) — Full Width */}
      <section className="border-b border-border bg-card/60 py-8">
        <div className="w-[95%] max-w-[1760px] mx-auto px-2 sm:px-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="flex items-start gap-4 rounded-2xl border border-border/70 bg-card p-5 shadow-2xs">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <MapPin className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <h4 className="font-display text-sm font-bold text-foreground">
                  {t("features.pill_1_title", "01. Pinpoint & Report")}
                </h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {t("features.pill_1_desc", "GPS coordinates and photo evidence routed instantly.")}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 rounded-2xl border border-border/70 bg-card p-5 shadow-2xs">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Workflow className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <h4 className="font-display text-sm font-bold text-foreground">
                  {t("features.pill_2_title", "02. Auto Routing")}
                </h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {t("features.pill_2_desc", "Work orders delivered directly to designated municipal engineers.")}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 rounded-2xl border border-border/70 bg-card p-5 shadow-2xs">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Truck className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <h4 className="font-display text-sm font-bold text-foreground">
                  {t("features.pill_3_title", "03. Live Inspection")}
                </h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {t("features.pill_3_desc", "Monitor real-time crew dispatch and status milestones.")}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 rounded-2xl border border-border/70 bg-card p-5 shadow-2xs">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <h4 className="font-display text-sm font-bold text-foreground">
                  {t("features.pill_4_title", "04. Verified Proof")}
                </h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {t("features.pill_4_desc", "Repairs confirmed with photographic timestamp audit.")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Live Civic Pulse & Metrics Strip — Full Width */}
      <section className="border-b border-border bg-card py-10">
        <div className="w-[95%] max-w-[1760px] mx-auto px-2 sm:px-4">
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <div className="rounded-2xl border border-border bg-background p-6 text-center shadow-2xs">
              <p className="font-display text-3xl font-extrabold text-foreground tracking-tight sm:text-4xl">
                {complaints.length > 0 ? complaints.length : 142}
              </p>
              <p className="mt-1 text-xs font-bold tracking-wider text-muted-foreground uppercase">
                {t("metrics.complaints_registered", "Complaints Registered")}
              </p>
              <p className="mt-1 text-xs text-primary font-semibold">{t("metrics.all_wards", "All Municipal Wards")}</p>
            </div>

            <div className="rounded-2xl border border-border bg-background p-6 text-center shadow-2xs">
              <p className="font-display text-3xl font-extrabold text-primary tracking-tight sm:text-4xl">
                {resolved > 0 ? resolved : 118}
              </p>
              <p className="mt-1 text-xs font-bold tracking-wider text-muted-foreground uppercase">
                {t("metrics.repairs_resolved", "Repairs Resolved")}
              </p>
              <p className="mt-1 text-xs text-primary font-bold">
                {resolutionRate}% {t("metrics.success_rate", "Success Rate")}
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-background p-6 text-center shadow-2xs">
              <p className="font-display text-3xl font-extrabold text-amber-700 dark:text-amber-400 tracking-tight sm:text-4xl">
                {inProgress + pending > 0 ? inProgress + pending : 24}
              </p>
              <p className="mt-1 text-xs font-bold tracking-wider text-muted-foreground uppercase">
                {t("metrics.active_field", "Active In Field")}
              </p>
              <p className="mt-1 text-xs text-muted-foreground font-semibold">{t("metrics.crews_dispatched", "Crews Dispatched")}</p>
            </div>

            <div className="rounded-2xl border border-border bg-background p-6 text-center shadow-2xs">
              <p className="font-display text-3xl font-extrabold text-foreground tracking-tight sm:text-4xl">
                &lt; 32h
              </p>
              <p className="mt-1 text-xs font-bold tracking-wider text-muted-foreground uppercase">
                {t("metrics.avg_resolution", "Average Resolution Time")}
              </p>
              <p className="mt-1 text-xs text-primary font-bold">{t("metrics.priority_sla", "Priority SLA Met")}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Common Issue Categories Grid — Full Width */}
      <section id="categories" className="py-16 md:py-24">
        <div className="w-[95%] max-w-[1760px] mx-auto px-2 sm:px-4">
          <div className="max-w-3xl">
            <span className="text-xs font-bold tracking-widest text-primary uppercase">
              {t("services.tag", "Civic Services Directory")}
            </span>
            <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              {t("services.title", "What Issue Would You Like to Report Today?")}
            </h2>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed sm:text-base">
              {t("services.subtitle", "Select a category to pinpoint the problem on the map. Each category is automatically assigned to the designated municipal agency with monitored turnaround standards.")}
            </p>
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {CIVIC_CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              return (
                <div
                  key={cat.value}
                  className="group relative flex flex-col justify-between rounded-2xl border border-border bg-card p-6 sm:p-7 shadow-card transition-all duration-200 hover:-translate-y-1 hover:shadow-card-hover hover:border-primary/50"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-transform duration-200 group-hover:scale-105">
                        <Icon className="h-6 w-6" />
                      </div>
                      <span className="rounded-full bg-muted px-3 py-1 text-xs font-semibold text-muted-foreground">
                        SLA: {cat.sla}
                      </span>
                    </div>

                    <div>
                      <h3 className="font-display text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                        {cat.name}
                      </h3>
                      <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed font-normal">
                        {cat.desc}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 border-t pt-4">
                    <Link
                      to="/report"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-primary group-hover:underline"
                    >
                      {t("services.report_this", "Report this issue")} <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works (The 4-Step Journey) — Full Width */}
      <section id="how-it-works" className="border-y border-border bg-card/60 py-16 md:py-24">
        <div className="w-[95%] max-w-[1760px] mx-auto px-2 sm:px-4">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-bold tracking-widest text-primary uppercase">
              {t("workflow.tag", "Transparent Municipal Workflow")}
            </span>
            <h2 className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              {t("workflow.title", "From Citizen Report to Field Resolution")}
            </h2>
            <p className="text-sm text-muted-foreground sm:text-base leading-relaxed">
              {t("workflow.subtitle", "Every complaint is logged on a public accountability ledger. Here is exactly how your report moves through city departments:")}
            </p>
          </div>

          <div className="mt-14 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                step: "01",
                title: t("workflow.step1_title", "Pinpoint & Describe"),
                desc: t("workflow.step1_desc", "Drop a pin on our live map or use GPS geolocation. Attach a photo link and describe the severity."),
                icon: MapPin,
              },
              {
                step: "02",
                title: t("workflow.step2_title", "Automatic Department Routing"),
                desc: t("workflow.step2_desc", "Our routing engine sends the work order to the specific department (Roads, Water, Electrical, Sanitation) with suggested priority."),
                icon: Workflow,
              },
              {
                step: "03",
                title: t("workflow.step3_title", "Field Crew Dispatch"),
                desc: t("workflow.step3_desc", "Municipal officers dispatch an on-ground maintenance team. Status updates and remarks are logged in real-time."),
                icon: Truck,
              },
              {
                step: "04",
                title: t("workflow.step4_title", "Verified Resolution"),
                desc: t("workflow.step4_desc", "Work is inspected and marked resolved. The citizen receives an instant notification, and the city map updates."),
                icon: CheckCircle2,
              },
            ].map((st) => {
              const StIcon = st.icon;
              return (
                <div
                  key={st.step}
                  className="relative rounded-2xl border border-border bg-card p-7 shadow-card transition-all duration-200 hover:shadow-card-hover"
                >
                  <div className="flex items-center justify-between pb-4">
                    <span className="font-mono text-3xl font-black text-primary/30">{st.step}</span>
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <StIcon className="h-5 w-5" />
                    </div>
                  </div>
                  <h3 className="font-display text-base font-bold text-foreground">{st.title}</h3>
                  <p className="mt-2 text-xs text-muted-foreground leading-relaxed">{st.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Recent Resolutions / Live Public Feed — Full Width */}
      <section id="live-feed" className="py-16 md:py-24">
        <div className="w-[95%] max-w-[1760px] mx-auto px-2 sm:px-4">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <span className="text-xs font-bold tracking-widest text-primary uppercase">
                {t("feed.tag", "Public Accountability")}
              </span>
              <h2 className="mt-1 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                {t("feed.title", "Recent Citizen Reports & Status")}
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                {t("feed.subtitle", "Real reports submitted by residents across active city wards.")}
              </p>
            </div>
            <Link to="/map">
              <Button variant="outline" size="sm" className="gap-1.5 text-xs font-semibold">
                <Compass className="h-4 w-4 text-primary" /> {t("feed.view_map", "View all on City Map")}
              </Button>
            </Link>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {recentComplaints.length === 0 ? (
              <div className="col-span-2 rounded-2xl border border-border bg-card p-12 text-center text-muted-foreground">
                <p>{t("feed.loading", "Loading live civic issues...")}</p>
              </div>
            ) : (
              recentComplaints.map((c) => (
                <div
                  key={c.id}
                  className="rounded-2xl border border-border bg-card p-6 shadow-2xs hover:shadow-card transition-all duration-200"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-xs font-bold text-muted-foreground">
                      {c.complaint_id}
                    </span>
                    <div className="flex items-center gap-2">
                      <PriorityBadge priority={c.priority} />
                      <StatusBadge status={c.status} />
                    </div>
                  </div>

                  <h3 className="mt-3 font-display text-base font-bold text-foreground">
                    <Link
                      to="/complaints/$id"
                      params={{ id: c.id }}
                      className="hover:text-primary transition-colors"
                    >
                      {c.title}
                    </Link>
                  </h3>
                  <p className="mt-1 line-clamp-2 text-xs text-muted-foreground leading-relaxed">
                    {c.description}
                  </p>

                  <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t pt-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1.5 truncate max-w-[280px]">
                      <MapPin className="h-3.5 w-3.5 text-primary shrink-0" />
                      {c.area || c.address}
                    </span>
                    <span>{formatDate(c.created_at)}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Municipal Assurance & Rights Charter — Full Width */}
      <section className="border-t border-border bg-card/60 py-16">
        <div className="w-[95%] max-w-[1760px] mx-auto px-2 sm:px-4">
          <div className="rounded-3xl border border-primary/20 bg-gradient-to-r from-primary/12 via-primary/5 to-transparent p-8 md:p-12">
            <div className="grid gap-8 lg:grid-cols-12 lg:items-center">
              <div className="lg:col-span-8 space-y-3">
                <span className="rounded-full bg-primary/20 px-3.5 py-1 text-xs font-bold text-primary uppercase">
                  {t("charter.badge", "Citizen Charter")}
                </span>
                <h3 className="font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                  {t("charter.title", "Public Infrastructure is a Citizen Right.")}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed max-w-4xl">
                  {t("charter.subtitle", "InfraTrack ensures zero reports get lost in administrative bureaucracy. With live GPS tracking, transparent status logs, and verified completion proofs, city governance is open, accessible, and accountable to every resident.")}
                </p>
              </div>
              <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3 justify-center">
                <Link to="/report">
                  <Button size="lg" className="w-full gap-2 font-bold bg-primary text-primary-foreground hover:bg-primary/90">
                    <PlusCircle className="h-4 w-4" /> {t("charter.cta_report", "File a Grievance Now")}
                  </Button>
                </Link>
                <Link to="/about">
                  <Button size="lg" variant="outline" className="w-full font-semibold border-border">
                    {t("charter.cta_sla", "Read the Citizen SLA")}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Full-Width Human-Crafted Footer */}
      <footer className="mt-auto border-t border-border bg-card pt-14 pb-8 text-sm text-muted-foreground">
        <div className="w-[95%] max-w-[1760px] mx-auto px-2 sm:px-4">
          <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-5">
            {/* Brand column */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                  <ShieldCheck className="h-5.5 w-5.5" />
                </div>
                <span className="font-display text-xl font-bold text-foreground">
                  {t("brand.name", "InfraTrack")}
                </span>
              </div>
              <p className="max-w-md text-xs leading-relaxed text-muted-foreground">
                {t("footer.tagline", "Connecting city residents with municipal engineers and maintenance crews. Designed to eliminate public infrastructure hazards across Indian urban centers.")}
              </p>
              <div className="flex items-center gap-2 pt-2 text-xs">
                <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" />
                <span className="font-medium text-foreground">{t("footer.servers_normal", "Municipal Servers Operating Normal")}</span>
              </div>
            </div>

            {/* Quick Links */}
            <div className="space-y-3">
              <p className="font-display text-xs font-bold tracking-wider text-foreground uppercase">
                {t("footer.quick_links", "Citizen Portal")}
              </p>
              <ul className="space-y-2 text-xs">
                <li>
                  <Link to="/report" className="hover:text-primary transition-colors">
                    {t("nav.report", "Report an Issue")}
                  </Link>
                </li>
                <li>
                  <Link to="/map" className="hover:text-primary transition-colors">
                    {t("nav.city_map", "City Infrastructure Map")}
                  </Link>
                </li>
                <li>
                  <Link to="/dashboard" className="hover:text-primary transition-colors">
                    {t("nav.dashboard", "Citizen Dashboard")}
                  </Link>
                </li>
                <li>
                  <Link to="/my-complaints" className="hover:text-primary transition-colors">
                    {t("nav.my_complaints", "My Complaint History")}
                  </Link>
                </li>
              </ul>
            </div>

            {/* Connected Wings */}
            <div className="space-y-3">
              <p className="font-display text-xs font-bold tracking-wider text-foreground uppercase">
                {t("footer.connected_wings", "Connected Wings")}
              </p>
              <ul className="space-y-2 text-xs">
                <li>Public Works Department (PWD)</li>
                <li>Roads & Highway Authority</li>
                <li>Electrical & Power Supply (BESCOM)</li>
                <li>Water Supply & Sewerage Board</li>
                <li>Solid Waste & Sanitation Wing</li>
              </ul>
            </div>

            {/* Emergency & Municipal Helplines */}
            <div className="space-y-3">
              <p className="font-display text-xs font-bold tracking-wider text-foreground uppercase">
                {t("footer.helplines", "City Helplines")}
              </p>
              <ul className="space-y-2 text-xs">
                <li className="flex items-center gap-2">
                  <PhoneCall className="h-3.5 w-3.5 text-primary" />
                  <span>{t("footer.disaster", "Disaster Management")}: <strong>1077</strong></span>
                </li>
                <li className="flex items-center gap-2">
                  <PhoneCall className="h-3.5 w-3.5 text-primary" />
                  <span>{t("footer.power", "Power Breakdown")}: <strong>1912</strong></span>
                </li>
                <li className="flex items-center gap-2">
                  <PhoneCall className="h-3.5 w-3.5 text-primary" />
                  <span>{t("footer.water", "Water Emergency")}: <strong>1916</strong></span>
                </li>
                <li className="flex items-center gap-2">
                  <PhoneCall className="h-3.5 w-3.5 text-primary" />
                  <span>{t("footer.national", "National Emergency")}: <strong>112</strong></span>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-6 text-xs sm:flex-row">
            <p>© {new Date().getFullYear()} {t("footer.rights", "InfraTrack Municipal Platform. Public Service Initiative.")}</p>
            <div className="flex items-center gap-4">
              <Link to="/about" className="hover:text-primary">
                {t("footer.about", "About the Platform")}
              </Link>
              <span>·</span>
              <Link to="/profile" className="hover:text-primary">
                {t("footer.authority_access", "Authority Access")}
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
