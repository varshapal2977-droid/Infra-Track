import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  AlertCircle,
  ArrowRight,
  Bell,
  BellOff,
  Check,
  CheckCheck,
  Clock,
  Loader2,
  PlusCircle,
  RefreshCw,
  ShieldCheck,
} from "lucide-react";
import { RequireAuth } from "@/components/RequireAuth";
import { AppShell } from "@/components/AppShell";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/context/LanguageContext";
import { formatDateTime } from "@/lib/infratrack";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

type Notification = {
  id: string;
  message: string;
  is_read: boolean;
  created_at: string;
  complaint_id: string | null;
  user_id: string;
};

export const Route = createFileRoute("/notifications")({
  head: () => ({
    meta: [
      { title: "Notifications & Civic Alerts — InfraTrack" },
      { name: "description", content: "Status updates on the civic issues you follow." },
      { property: "og:title", content: "Notifications — InfraTrack" },
      { property: "og:description", content: "Updates on your reported civic issues." },
    ],
  }),
  component: () => (
    <RequireAuth>
      <NotificationsRouteWrapper />
    </RequireAuth>
  ),
});

function NotificationsRouteWrapper() {
  const { t } = useLanguage();
  return (
    <AppShell title={t("notifications.title", "Activity Updates & Alerts")} fullWidth>
      <Notifications />
    </AppShell>
  );
}

function groupNotifications(items: Notification[]) {
  const today: Notification[] = [];
  const yesterday: Notification[] = [];
  const earlier: Notification[] = [];

  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const yesterdayStart = todayStart - 86400000;

  for (const item of items) {
    const itemTime = new Date(item.created_at).getTime();
    if (itemTime >= todayStart) {
      today.push(item);
    } else if (itemTime >= yesterdayStart) {
      yesterday.push(item);
    } else {
      earlier.push(item);
    }
  }

  return { today, yesterday, earlier };
}

function Notifications() {
  const { user, loading: authLoading } = useAuth();
  const { t, language } = useLanguage();
  const qc = useQueryClient();
  const [marking, setMarking] = useState(false);

  const {
    data = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["notifications", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Supabase notifications query error:", error);
        throw error;
      }
      return (data ?? []) as Notification[];
    },
    enabled: !!user,
    retry: 2,
    staleTime: 1000 * 30, // 30 seconds
  });

  const unreadCount = data.filter((n) => !n.is_read).length;
  const groups = groupNotifications(data);

  async function markAllRead() {
    if (!user || unreadCount === 0 || marking) return;
    setMarking(true);
    try {
      const { error } = await supabase
        .from("notifications")
        .update({ is_read: true })
        .eq("user_id", user.id)
        .eq("is_read", false);

      if (error) throw error;

      await qc.invalidateQueries({ queryKey: ["notifications", user.id] });
      toast.success(
        language === "hi"
          ? "सभी सूचनाएं पढ़ी हुई चिन्हित की गईं।"
          : "All notifications marked as read."
      );
    } catch (err: unknown) {
      console.error("Mark all read error:", err);
      toast.error(
        language === "hi"
          ? "सूचनाएं अपडेट करने में विफल"
          : "Failed to mark notifications as read."
      );
    } finally {
      setMarking(false);
    }
  }

  async function markSingleRead(id: string, currentRead: boolean) {
    if (currentRead || !user) return;
    try {
      await supabase
        .from("notifications")
        .update({ is_read: true })
        .eq("id", id)
        .eq("user_id", user.id);

      qc.setQueryData<Notification[]>(["notifications", user.id], (old = []) =>
        old.map((n) => (n.id === id ? { ...n, is_read: true } : n))
      );
    } catch (err) {
      console.error("Mark single read error:", err);
    }
  }

  const renderSection = (title: string, list: Notification[]) => {
    if (list.length === 0) return null;

    return (
      <div key={title} className="space-y-3">
        <div className="flex items-center gap-2 px-1">
          <span className="h-1.5 w-1.5 rounded-full bg-primary" />
          <h3 className="font-display text-xs font-bold uppercase tracking-wider text-muted-foreground">
            {title} ({list.length})
          </h3>
        </div>

        <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm divide-y divide-border/60">
          {list.map((n) => (
            <div
              key={n.id}
              onClick={() => markSingleRead(n.id, n.is_read)}
              className={`group flex items-start gap-4 p-5 transition-colors cursor-pointer ${n.is_read ? "bg-card hover:bg-muted/30" : "bg-primary/5 hover:bg-primary/8"
                }`}
            >
              {/* Notification Type Icon */}
              <div
                className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border ${n.is_read
                    ? "border-border bg-muted/60 text-muted-foreground"
                    : "border-primary/30 bg-primary/10 text-primary shadow-2xs"
                  }`}
              >
                <Bell className="h-4.5 w-4.5" />
              </div>

              {/* Notification Message & Timestamp */}
              <div className="min-w-0 flex-1 space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <p
                    className={`text-sm leading-snug ${n.is_read ? "text-foreground/80 font-medium" : "text-foreground font-bold"
                      }`}
                  >
                    {n.message}
                  </p>
                  {!n.is_read ? (
                    <span className="inline-flex items-center rounded-full bg-primary px-2 py-0.5 text-[10px] font-bold text-primary-foreground tracking-wide uppercase">
                      {t("notifications.unread_badge", "New")}
                    </span>
                  ) : null}
                </div>

                <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Clock className="h-3.5 w-3.5 shrink-0" />
                  {formatDateTime(n.created_at)}
                </p>
              </div>

              {/* View Ticket Link */}
              {n.complaint_id ? (
                <Link
                  to="/complaints/$id"
                  params={{ id: n.complaint_id }}
                  className="shrink-0 ml-2"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Button
                    variant="ghost"
                    size="sm"
                    className="gap-1.5 text-xs font-bold text-primary hover:text-primary hover:bg-primary/10"
                  >
                    {t("notifications.view_ticket", "View Ticket")}{" "}
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </Link>
              ) : null}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8 w-full">
      {/* Notifications Header Toolbar — Generous full-width layout */}
      <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-card flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            {t("notifications.title", "Activity Updates & Alerts")}
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1 font-medium">
            {unreadCount > 0 ? (
              <span className="font-bold text-primary">
                {unreadCount}{" "}
                {unreadCount === 1
                  ? t("notifications.unread", "unread notification")
                  : t("notifications.unreads", "unread notifications")}
              </span>
            ) : (
              t("notifications.all_caught_up", "All caught up")
            )}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            className="gap-1.5 text-xs font-semibold h-9 px-3.5 border-border"
          >
            <RefreshCw className="h-3.5 w-3.5 text-muted-foreground" />
            {t("action.refresh", "Refresh")}
          </Button>

          {unreadCount > 0 ? (
            <Button
              size="sm"
              className="gap-2 text-xs font-bold h-9 px-4 bg-primary text-primary-foreground hover:bg-primary/90 shadow-2xs"
              onClick={markAllRead}
              disabled={marking}
            >
              {marking ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <CheckCheck className="h-4 w-4" />
              )}
              {t("notifications.mark_all_read", "Mark all as read")}
            </Button>
          ) : null}
        </div>
      </div>

      {/* Main Content: Loading, Error, Empty, or Grouped Lists */}
      {authLoading || isLoading ? (
        <div className="rounded-3xl border border-border bg-card p-16 text-center shadow-card space-y-3">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
          <p className="font-medium text-sm text-muted-foreground">
            {t("notifications.checking", "Checking for latest updates...")}
          </p>
        </div>
      ) : isError ? (
        <div className="rounded-3xl border border-destructive/30 bg-destructive/5 p-12 text-center shadow-card space-y-4">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
            <AlertCircle className="h-6 w-6" />
          </div>
          <div className="space-y-1">
            <h3 className="font-display text-lg font-bold text-foreground">
              {t("notifications.error_title", "Unable to load notifications")}
            </h3>
            <p className="text-xs text-muted-foreground max-w-md mx-auto">
              {error instanceof Error
                ? error.message
                : t("notifications.error_desc", "Could not connect to the municipal notifications service. Please try again.")}
            </p>
          </div>
          <Button
            size="sm"
            onClick={() => refetch()}
            className="gap-2 font-bold text-xs bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            {t("notifications.retry", "Retry")}
          </Button>
        </div>
      ) : data.length === 0 ? (
        <div className="rounded-3xl border border-border bg-card p-16 text-center shadow-card space-y-4">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
            <BellOff className="h-7 w-7 text-muted-foreground/60" />
          </div>
          <div className="space-y-1.5">
            <h3 className="font-display text-lg font-bold text-foreground">
              {t("notifications.empty_title", "No notifications yet")}
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
              {t("notifications.empty_desc", "When authorities update the status of complaints you report or work on, alerts will appear right here.")}
            </p>
          </div>
          <div className="pt-2">
            <Link to="/report">
              <Button size="sm" className="gap-2 font-bold text-xs bg-primary text-primary-foreground hover:bg-primary/90">
                <PlusCircle className="h-4 w-4" /> {t("nav.report", "Report an Issue")}
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          {renderSection(t("notifications.today", "Today"), groups.today)}
          {renderSection(t("notifications.yesterday", "Yesterday"), groups.yesterday)}
          {renderSection(t("notifications.earlier", "Earlier"), groups.earlier)}
        </div>
      )}
    </div>
  );
}
