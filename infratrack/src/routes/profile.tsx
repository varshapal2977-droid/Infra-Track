import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { ShieldCheck } from "lucide-react";
import { RequireAuth } from "@/components/RequireAuth";
import { AppShell } from "@/components/AppShell";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatDate } from "@/lib/infratrack";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Your profile — InfraTrack" },
      { name: "description", content: "Update your contact details and authority access." },
      { property: "og:title", content: "Your profile — InfraTrack" },
      { property: "og:description", content: "Manage your InfraTrack account details." },
    ],
  }),
  component: () => (
    <RequireAuth>
      <AppShell title="Profile">
        <ProfilePage />
      </AppShell>
    </RequireAuth>
  ),
});

function ProfilePage() {
  const { profile, user, isAdmin, refresh } = useAuth();
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setFullName(profile?.full_name ?? "");
    setPhone(profile?.phone ?? "");
  }, [profile]);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    const { error } = await supabase
      .from("profiles")
      .update({ full_name: fullName, phone: phone || null })
      .eq("id", user.id);
    setSaving(false);
    if (error) toast.error(error.message);
    else {
      toast.success("Profile updated");
      await refresh();
    }
  }

  async function claimAdmin(e: React.FormEvent) {
    e.preventDefault();
    const { data, error } = await supabase.rpc("claim_admin_role", { _code: code.trim() });
    if (error) {
      toast.error(error.message);
      return;
    }
    if (!data) {
      toast.error("That access code is not valid.");
      return;
    }
    setCode("");
    await refresh();
    toast.success("Authority access granted. Your menu now shows the admin pages.");
  }

  return (
    <div className="grid max-w-4xl gap-6 lg:grid-cols-2">
      <form onSubmit={save} className="space-y-4 rounded-xl border bg-card p-5 shadow-card">
        <h2 className="font-display text-lg font-semibold">Account details</h2>
        <div className="space-y-2">
          <Label htmlFor="name">Full name</Label>
          <Input id="name" value={fullName} onChange={(e) => setFullName(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" value={profile?.email ?? user?.email ?? ""} disabled />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            value={phone}
            placeholder="+91 98xxxxxxxx"
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>
        <p className="text-xs text-muted-foreground">
          Member since {formatDate(profile?.created_at)}
        </p>
        <Button type="submit" disabled={saving}>
          {saving ? "Saving…" : "Save changes"}
        </Button>
      </form>

      <div className="space-y-4 rounded-xl border bg-card p-5 shadow-card">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-primary" />
          <h2 className="font-display text-lg font-semibold">Access level</h2>
        </div>
        <p className="text-sm text-muted-foreground">
          You are signed in as{" "}
          <span className="font-medium text-foreground">{isAdmin ? "Authority" : "Citizen"}</span>.
        </p>
        {isAdmin ? (
          <p className="text-sm text-muted-foreground">
            You can manage complaints, departments and view city-wide analytics.
          </p>
        ) : (
          <form onSubmit={claimAdmin} className="space-y-3">
            <Label htmlFor="code">Authority access code</Label>
            <Input
              id="code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Enter the code given by your department"
            />
            <Button type="submit" variant="secondary">
              Unlock authority access
            </Button>
            <p className="text-xs text-muted-foreground">
              Demo code: <span className="font-mono">INFRA-ADMIN-2026</span>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
