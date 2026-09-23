import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Bell } from "lucide-react";
import { RequireAuth } from "@/components/RequireAuth";
import { AppShell } from "@/components/AppShell";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { formatDateTime } from "@/lib/infratrack";
import { Button } from "@/components/ui/button";

type Notification = {
  id: string;
  message: string;
  is_read: boolean;
  created_at: string;
  complaint_id: string | null;
};

export const Route = createFileRoute("/notifications")({
  head: () => ({
    meta: [
      { title: "Notifications — InfraTrack" },
      { name: "description", content: "Status updates on the civic issues you follow." },
      { property: "og:title", content: "Notifications — InfraTrack" },
      { property: "og:description", content: "Updates on your reported civic issues." },
    ],
  }),
  component: () => (
    <RequireAuth>
      <AppShell title="Notifications">
        <Notifications />
      </AppShell>
    </RequireAuth>
  ),
});

function Notifications() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const { data = [], isLoading } = useQuery({
    queryKey: ["notifications", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as Notification[];
    },
    enabled: !!user,
  });

  async function markAllRead() {
    await supabase.from("notifications").update({ is_read: true }).eq("is_read", false);
    qc.invalidateQueries({ queryKey: ["notifications"] });
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <p className="text-sm text-muted-foreground">
          {data.filter((n) => !n.is_read).length} unread
        </p>
        <Button size="sm" variant="outline" className="ml-auto" onClick={markAllRead}>
          Mark all as read
        </Button>
      </div>

      <div className="rounded-xl border bg-card shadow-card">
        {isLoading ? (
          <p className="p-5 text-sm text-muted-foreground">Loading…</p>
        ) : data.length === 0 ? (
          <p className="p-5 text-sm text-muted-foreground">No notifications yet.</p>
        ) : (
          <ul className="divide-y">
            {data.map((n) => (
              <li key={n.id} className="flex gap-3 px-5 py-4">
                <Bell
                  className={`mt-0.5 h-4 w-4 ${n.is_read ? "text-muted-foreground" : "text-primary"}`}
                />
                <div className="min-w-0 flex-1">
                  <p className={n.is_read ? "text-muted-foreground" : "font-medium"}>{n.message}</p>
                  <p className="text-xs text-muted-foreground">{formatDateTime(n.created_at)}</p>
                </div>
                {n.complaint_id ? (
                  <Link
                    to="/complaints/$id"
                    params={{ id: n.complaint_id }}
                    className="text-sm text-primary hover:underline"
                  >
                    View
                  </Link>
                ) : null}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
