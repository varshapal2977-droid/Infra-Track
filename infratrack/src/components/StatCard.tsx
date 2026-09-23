import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function StatCard({
  label,
  value,
  icon: Icon,
  hint,
  tone = "default",
}: {
  label: string;
  value: string | number;
  icon?: LucideIcon;
  hint?: string;
  tone?: "default" | "accent" | "success" | "destructive" | "info";
}) {
  const tones = {
    default: "text-primary bg-primary/10",
    accent: "text-accent-foreground bg-accent/25",
    success: "text-success bg-success/12",
    destructive: "text-destructive bg-destructive/10",
    info: "text-info bg-info/10",
  } as const;

  return (
    <div className="rounded-xl border bg-card p-5 shadow-card">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
            {label}
          </p>
          <p className="mt-2 font-display text-3xl font-semibold">{value}</p>
          {hint ? <p className="mt-1 text-xs text-muted-foreground">{hint}</p> : null}
        </div>
        {Icon ? (
          <span className={cn("rounded-lg p-2", tones[tone])}>
            <Icon className="h-5 w-5" />
          </span>
        ) : null}
      </div>
    </div>
  );
}
