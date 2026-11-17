import { useEffect, useState, type ReactNode } from "react";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import {
  BarChart3,
  Bell,
  Building2,
  ChevronRight,
  ClipboardList,
  Compass,
  FileText,
  HelpCircle,
  LayoutDashboard,
  LogOut,
  Map as MapIcon,
  Menu,
  PlusCircle,
  ShieldAlert,
  ShieldCheck,
  User,
  X,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/context/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { UserAvatar } from "@/components/UserAvatar";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { cn } from "@/lib/utils";

type NavItem = {
  to: string;
  label: string;
  icon: typeof LayoutDashboard;
  section?: string;
  badge?: string;
};

export function AppShell({
  children,
  title,
  fullWidth = false,
}: {
  children: ReactNode;
  title: string;
  fullWidth?: boolean;
}) {
  const { profile, isAdmin, signOut, user } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [open, setOpen] = useState(false);
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("notifications")
      .select("id", { count: "exact", head: true })
      .eq("is_read", false)
      .then(({ count }) => setUnread(count ?? 0));
  }, [user, pathname]);

  const citizenNav: NavItem[] = [
    { to: "/dashboard", label: t("nav.dashboard", "Dashboard"), icon: LayoutDashboard, section: t("nav.core_portal", "Core Portal") },
    { to: "/report", label: t("nav.report", "Report an Issue"), icon: PlusCircle, section: t("nav.core_portal", "Core Portal") },
    { to: "/my-complaints", label: t("nav.my_complaints", "My Complaints"), icon: FileText, section: t("nav.core_portal", "Core Portal") },
    { to: "/map", label: t("nav.city_map", "City Live Map"), icon: MapIcon, section: t("nav.city_surveillance", "City Surveillance") },
    { to: "/notifications", label: t("nav.notifications", "Notifications"), icon: Bell, section: t("nav.account_updates", "Account & Updates") },
    { to: "/profile", label: t("nav.profile", "Profile & Role"), icon: User, section: t("nav.account_updates", "Account & Updates") },
  ];

  const adminNav: NavItem[] = [
    { to: "/admin", label: t("nav.admin_overview", "Authority Overview"), icon: LayoutDashboard, section: t("nav.administration", "Administration") },
    { to: "/admin/complaints", label: t("nav.complaints_queue", "Complaints Queue"), icon: ClipboardList, section: t("nav.administration", "Administration") },
    { to: "/admin/analytics", label: t("nav.city_analytics", "City Analytics"), icon: BarChart3, section: t("nav.administration", "Administration") },
    { to: "/admin/departments", label: t("nav.departments", "Departments"), icon: Building2, section: t("nav.administration", "Administration") },
    { to: "/map", label: t("nav.city_map", "City Live Map"), icon: MapIcon, section: t("nav.city_surveillance", "City Surveillance") },
    { to: "/notifications", label: t("nav.alerts", "Alerts & Messages"), icon: Bell, section: t("nav.account_updates", "Account & Updates") },
    { to: "/profile", label: t("nav.officer_profile", "Officer Profile"), icon: User, section: t("nav.account_updates", "Account & Updates") },
  ];

  const nav = isAdmin ? adminNav : citizenNav;
  const sections = Array.from(new Set(nav.map((item) => item.section || "General")));

  const initials = profile?.full_name
    ? profile.full_name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase()
    : "CT";

  const sidebarContent = (
    <div className="flex h-full flex-col bg-sidebar text-sidebar-foreground">
      {/* Brand Header */}
      <div className="flex items-center justify-between border-b border-sidebar-border/60 px-5 py-4.5">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-sidebar-primary text-sidebar-primary-foreground shadow-sm transition-transform group-hover:scale-105">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-display text-base font-bold tracking-tight text-white">
                {t("brand.name", "InfraTrack")}
              </span>
              <span className="rounded bg-sidebar-primary/20 px-1 py-0.2 text-[10px] font-semibold text-sidebar-primary uppercase">
                {t("brand.civic", "Civic")}
              </span>
            </div>
            <p className="text-[11px] text-sidebar-foreground/60 leading-none mt-0.5">
              {t("brand.tagline", "Municipal Resolution Portal")}
            </p>
          </div>
        </Link>
        <button
          onClick={() => setOpen(false)}
          className="rounded-lg p-1 text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-white md:hidden"
          aria-label="Close menu"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Live System Indicator */}
      <div className="mx-4 mt-3 rounded-lg border border-sidebar-border/40 bg-sidebar-accent/30 px-3 py-2 text-xs">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
          </span>
          <span className="font-medium text-emerald-300">
            {t("status.wards_active", "Wards Active & Connected")}
          </span>
        </div>
      </div>

      {/* Navigation Groups */}
      <nav className="flex-1 space-y-4 overflow-y-auto px-3 py-3">
        {sections.map((sectionName) => {
          const sectionItems = nav.filter((i) => (i.section || "General") === sectionName);
          return (
            <div key={sectionName} className="space-y-1">
              <p className="px-3 text-[11px] font-semibold tracking-wider text-sidebar-foreground/50 uppercase">
                {sectionName}
              </p>
              {sectionItems.map((item) => {
                const active = pathname === item.to || (item.to !== "/" && pathname.startsWith(item.to + "/"));
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "group flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-all duration-150",
                      active
                        ? "bg-sidebar-accent font-semibold text-white shadow-xs"
                        : "text-sidebar-foreground/75 hover:bg-sidebar-accent/50 hover:text-white",
                    )}
                  >
                    <item.icon
                      className={cn(
                        "h-4 w-4 shrink-0 transition-colors",
                        active ? "text-sidebar-primary" : "text-sidebar-foreground/60 group-hover:text-sidebar-primary",
                      )}
                    />
                    <span className="flex-1 truncate">{item.label}</span>
                    {item.to.includes("notifications") && unread > 0 ? (
                      <span className="rounded-full bg-sidebar-primary px-2 py-0.5 text-[11px] font-bold text-sidebar-primary-foreground">
                        {unread}
                      </span>
                    ) : null}
                  </Link>
                );
              })}
            </div>
          );
        })}
      </nav>

      {/* User Footer Profile */}
      <div className="border-t border-sidebar-border/60 bg-sidebar/50 p-3.5">
        <div className="flex items-center gap-3">
          <Link to="/profile" className="shrink-0 group" title={t("nav.profile", "View Profile")}>
            <UserAvatar
              src={profile?.avatar_url}
              name={profile?.full_name}
              size="md"
              className="transition-transform group-hover:scale-105"
            />
          </Link>
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-semibold text-white">
              {profile?.full_name || t("role.registered_citizen", "Registered Citizen")}
            </p>
            <p className="truncate text-[11px] text-sidebar-foreground/60">
              {profile?.email || user?.email}
            </p>
            <div className="mt-0.5 flex items-center gap-1.5">
              <span
                className={cn(
                  "inline-block h-1.5 w-1.5 rounded-full",
                  isAdmin ? "bg-amber-400" : "bg-emerald-400",
                )}
              />
              <span className="text-[10px] font-medium tracking-wide uppercase text-sidebar-foreground/80">
                {isAdmin ? t("role.officer", "Municipal Officer") : t("role.resident", "Resident")}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between border-t border-sidebar-border/40 pt-2 text-xs">
          <Link
            to="/about"
            className="flex items-center gap-1 text-[11px] text-sidebar-foreground/60 hover:text-white"
          >
            <HelpCircle className="h-3 w-3" /> {t("nav.about", "About InfraTrack")}
          </Link>
          <button
            onClick={async () => {
              await signOut();
              navigate({ to: "/", replace: true });
            }}
            className="flex items-center gap-1.5 rounded px-1.5 py-1 text-[11px] font-medium text-sidebar-foreground/75 hover:bg-destructive/15 hover:text-destructive-foreground transition-colors cursor-pointer"
          >
            <LogOut className="h-3 w-3" /> {t("nav.sign_out", "Sign out")}
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-background">
      {/* Desktop Sidebar */}
      <aside className="hidden w-64 shrink-0 md:block">{sidebarContent}</aside>

      {/* Mobile Drawer */}
      {open ? (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div className="relative h-full w-72 max-w-[85vw] shadow-2xl animate-in slide-in-from-left duration-200">
            {sidebarContent}
          </div>
          <button
            className="flex-1 bg-foreground/40 backdrop-blur-xs transition-opacity"
            onClick={() => setOpen(false)}
            aria-label="Close menu"
          />
        </div>
      ) : null}

      {/* Main Content Area */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Top Header */}
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b bg-card/95 px-4 backdrop-blur-md md:px-8">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setOpen(true)}
            aria-label="Toggle navigation"
          >
            <Menu className="h-5 w-5" />
          </Button>

          <div className="flex flex-col">
            <h1 className="font-display text-lg font-bold tracking-tight text-foreground sm:text-xl">
              {title}
            </h1>
          </div>

          <div className="ml-auto flex items-center gap-2.5">
            {/* Language Switcher */}
            <LanguageSwitcher size="sm" />

            <Link to="/map" className="hidden sm:inline-flex">
              <Button variant="outline" size="sm" className="gap-1.5 text-xs">
                <Compass className="h-3.5 w-3.5 text-primary" /> {t("dashboard.explore_map", "City Map")}
              </Button>
            </Link>

            <Link to="/notifications" className="relative">
              <Button
                variant="ghost"
                size="icon"
                className="relative text-foreground/80 hover:text-foreground"
                aria-label="Notifications"
              >
                <Bell className="h-4.5 w-4.5" />
                {unread > 0 ? (
                  <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
                  </span>
                ) : null}
              </Button>
            </Link>

            {!isAdmin ? (
              <Link to="/report">
                <Button size="sm" className="gap-1.5 font-medium shadow-xs">
                  <PlusCircle className="h-4 w-4" /> {t("nav.report", "Report Issue")}
                </Button>
              </Link>
            ) : null}

            {/* Profile Avatar Shortcut */}
            <Link to="/profile" className="flex items-center ml-1 group" title={t("nav.profile", "Account & Profile Photo")}>
              <UserAvatar
                src={profile?.avatar_url}
                name={profile?.full_name}
                size="sm"
                ring
                className="transition-transform group-hover:scale-105"
              />
            </Link>
          </div>
        </header>

        {/* Page Body: Full width enabled across all citizen views */}
        <main className="flex-1 w-[95%] max-w-[1760px] mx-auto p-4 sm:p-6 lg:p-8 transition-all">
          {children}
        </main>
      </div>
    </div>
  );
}
