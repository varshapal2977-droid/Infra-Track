import { useEffect, useState, type ReactNode } from "react";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import {
  BarChart3,
  Bell,
  Building2,
  ClipboardList,
  FileText,
  LayoutDashboard,
  LogOut,
  Map as MapIcon,
  Menu,
  PlusCircle,
  ShieldCheck,
  User,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type NavItem = { to: string; label: string; icon: typeof LayoutDashboard };

const citizenNav: NavItem[] = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/report", label: "Report an Issue", icon: PlusCircle },
  { to: "/my-complaints", label: "My Complaints", icon: FileText },
  { to: "/map", label: "Infrastructure Map", icon: MapIcon },
  { to: "/notifications", label: "Notifications", icon: Bell },
  { to: "/profile", label: "Profile", icon: User },
];

const adminNav: NavItem[] = [
  { to: "/admin", label: "Admin Dashboard", icon: LayoutDashboard },
  { to: "/admin/complaints", label: "Manage Complaints", icon: ClipboardList },
  { to: "/admin/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/admin/departments", label: "Departments", icon: Building2 },
  { to: "/map", label: "Infrastructure Map", icon: MapIcon },
  { to: "/notifications", label: "Notifications", icon: Bell },
  { to: "/profile", label: "Profile", icon: User },
];

export function AppShell({ children, title }: { children: ReactNode; title: string }) {
  const { profile, isAdmin, signOut, user } = useAuth();
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

  const nav = isAdmin ? adminNav : citizenNav;

  const sidebar = (
    <aside className="flex h-full w-64 flex-col bg-sidebar text-sidebar-foreground">
      <Link to="/" className="flex items-center gap-2 px-5 py-5">
        <span className="rounded-md bg-sidebar-primary p-1.5 text-sidebar-primary-foreground">
          <ShieldCheck className="h-5 w-5" />
        </span>
        <span className="font-display text-lg font-semibold tracking-tight">InfraTrack</span>
      </Link>
      <nav className="flex-1 space-y-1 px-3">
        {nav.map((item) => {
          const active = pathname === item.to || pathname.startsWith(item.to + "/");
          return (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setOpen(false)}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                active
                  ? "bg-sidebar-accent font-medium text-sidebar-accent-foreground"
                  : "text-sidebar-foreground/80 hover:bg-sidebar-accent/60",
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
              {item.label === "Notifications" && unread > 0 ? (
                <span className="ml-auto rounded-full bg-sidebar-primary px-2 text-xs font-semibold text-sidebar-primary-foreground">
                  {unread}
                </span>
              ) : null}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-sidebar-border p-4 text-sm">
        <p className="font-medium">{profile?.full_name || "Citizen"}</p>
        <p className="truncate text-xs text-sidebar-foreground/70">{profile?.email}</p>
        <p className="mt-1 text-xs text-sidebar-primary">{isAdmin ? "Authority" : "Citizen"}</p>
        <button
          onClick={async () => {
            await signOut();
            navigate({ to: "/", replace: true });
          }}
          className="mt-3 flex items-center gap-2 text-xs text-sidebar-foreground/80 hover:text-sidebar-foreground"
        >
          <LogOut className="h-3.5 w-3.5" /> Sign out
        </button>
      </div>
    </aside>
  );

  return (
    <div className="flex min-h-screen bg-background">
      <div className="hidden md:block">{sidebar}</div>
      {open ? (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div className="h-full">{sidebar}</div>
          <button className="flex-1 bg-foreground/40" onClick={() => setOpen(false)} aria-label="Close menu" />
        </div>
      ) : null}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center gap-3 border-b bg-card px-4 py-3 md:px-8">
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setOpen(true)}>
            <Menu className="h-5 w-5" />
          </Button>
          <h1 className="font-display text-xl font-semibold">{title}</h1>
          <div className="ml-auto flex items-center gap-2">
            <Link to="/notifications">
              <Button variant="ghost" size="icon" aria-label="Notifications">
                <Bell className="h-5 w-5" />
              </Button>
            </Link>
            {!isAdmin ? (
              <Link to="/report">
                <Button size="sm">
                  <PlusCircle className="mr-1.5 h-4 w-4" /> Report
                </Button>
              </Link>
            ) : null}
          </div>
        </header>
        <main className="flex-1 p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}
