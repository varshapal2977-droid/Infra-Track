import { useEffect, type ReactNode } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useAuth } from "@/hooks/useAuth";

/** Client-side route guard. Database access is additionally protected by row-level security. */
export function RequireAuth({ children, admin = false }: { children: ReactNode; admin?: boolean }) {
  const { user, isAdmin, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;
    if (!user) navigate({ to: "/login", replace: true });
    else if (admin && !isAdmin) navigate({ to: "/dashboard", replace: true });
  }, [loading, user, isAdmin, admin, navigate]);

  if (loading || !user || (admin && !isAdmin)) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-muted-foreground">
        Checking access…
      </div>
    );
  }
  return <>{children}</>;
}
