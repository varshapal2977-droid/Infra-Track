import { useEffect, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { ArrowLeft, Loader2, Lock, Mail, Phone, ShieldCheck, User } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/register")({
  head: () => ({
    meta: [
      { title: "Create Citizen Account — InfraTrack" },
      {
        name: "description",
        content: "Register on InfraTrack to report civic infrastructure issues in your city.",
      },
      { property: "og:title", content: "Create an account — InfraTrack" },
      { property: "og:description", content: "Join InfraTrack and report issues in your area." },
    ],
  }),
  component: RegisterPage,
});

function RegisterPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ full_name: "", email: "", phone: "", password: "" });
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!loading && user) navigate({ to: "/dashboard", replace: true });
  }, [loading, user, navigate]);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    const { error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        emailRedirectTo: window.location.origin,
        data: { full_name: form.full_name, phone: form.phone },
      },
    });
    setBusy(false);
    if (error) toast.error(error.message);
    else toast.success("Account created — you are now signed in!");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 px-4 py-12">
      <div className="w-full max-w-md rounded-2xl border border-border/80 bg-card p-8 shadow-card space-y-6">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <span className="font-display font-bold text-foreground">InfraTrack</span>
          </Link>
          <Link to="/" className="text-xs font-semibold text-muted-foreground hover:text-foreground flex items-center gap-1">
            <ArrowLeft className="h-3 w-3" /> Home
          </Link>
        </div>

        <div className="space-y-1">
          <h1 className="font-display text-2xl font-bold tracking-tight text-foreground">
            Register Citizen Account
          </h1>
          <p className="text-xs text-muted-foreground">
            Join thousands of residents improving city infrastructure through verified reporting.
          </p>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="name" className="text-xs font-semibold text-foreground/80">
              Full Name
            </Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="name"
                required
                value={form.full_name}
                onChange={set("full_name")}
                placeholder="Ramesh Sharma"
                className="pl-9 h-10 text-sm"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-xs font-semibold text-foreground/80">
              Email Address
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                required
                value={form.email}
                onChange={set("email")}
                placeholder="you@example.com"
                className="pl-9 h-10 text-sm"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="phone" className="text-xs font-semibold text-foreground/80">
              Phone Number (Optional)
            </Label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="phone"
                value={form.phone}
                onChange={set("phone")}
                placeholder="+91 98xxxxxxxx"
                className="pl-9 h-10 text-sm"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="password" className="text-xs font-semibold text-foreground/80">
              Password
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="password"
                type="password"
                required
                minLength={6}
                value={form.password}
                onChange={set("password")}
                placeholder="Minimum 6 characters"
                className="pl-9 h-10 text-sm"
              />
            </div>
          </div>

          <Button type="submit" className="w-full h-10 font-bold shadow-sm" disabled={busy}>
            {busy ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Creating Account...
              </>
            ) : (
              "Create Free Citizen Account"
            )}
          </Button>
        </form>

        <div className="border-t border-border/80 pt-4 text-center text-xs text-muted-foreground">
          <p>
            Already registered on InfraTrack?{" "}
            <Link to="/login" className="font-semibold text-primary hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
