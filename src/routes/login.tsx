import { useEffect, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { ArrowLeft, KeyRound, Loader2, Lock, Mail, ShieldCheck } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign in — InfraTrack Civic Portal" },
      { name: "description", content: "Sign in to report and track civic infrastructure issues." },
      { property: "og:title", content: "Sign in — InfraTrack" },
      { property: "og:description", content: "Access your InfraTrack complaints dashboard." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const { user, isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!loading && user) navigate({ to: isAdmin ? "/admin" : "/dashboard", replace: true });
  }, [loading, user, isAdmin, navigate]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (error) toast.error(error.message);
    else toast.success("Welcome back to InfraTrack!");
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
            Sign In to Citizen Portal
          </h1>
          <p className="text-xs text-muted-foreground">
            Access your filed reports, track work orders, and receive official updates.
          </p>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
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
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="citizen@example.com"
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="pl-9 h-10 text-sm"
              />
            </div>
          </div>

          <Button type="submit" className="w-full h-10 font-bold shadow-sm" disabled={busy}>
            {busy ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Verifying...
              </>
            ) : (
              "Sign In to Account"
            )}
          </Button>
        </form>

        <div className="border-t border-border/80 pt-4 text-center text-xs text-muted-foreground space-y-2">
          <p>
            Do not have an account yet?{" "}
            <Link to="/register" className="font-semibold text-primary hover:underline">
              Register now
            </Link>
          </p>
          <p className="text-[11px] text-muted-foreground/75">
            Protected by municipal data encryption & citizen rights charter.
          </p>
        </div>
      </div>
    </div>
  );
}
