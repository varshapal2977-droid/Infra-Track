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
    default: "text-primary bg-primary/10 border-primary/20",
    accent: "text-accent-foreground bg-accent/20 border-accent/30",
    success: "text-success bg-success/12 border-success/25",
    destructive: "text-destructive bg-destructive/10 border-destructive/25",
    info: "text-info bg-info/10 border-info/25",
  } as const;

  return (
    <div className="group relative overflow-hidden rounded-2xl border bg-card p-5 shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:shadow-card-hover">
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <p className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
            {label}
          </p>
          <p className="font-display text-3xl font-bold tracking-tight text-foreground">
            {value}
          </p>
          {hint ? (
            <p className="flex items-center gap-1.5 pt-0.5 text-xs text-muted-foreground">
              {hint}
            </p>
          ) : null}
        </div>
        {Icon ? (
          <span
            className={cn(
              "flex h-11 w-11 items-center justify-center rounded-xl border transition-transform duration-200 group-hover:scale-105",
              tones[tone],
            )}
          >
            <Icon className="h-5 w-5" />
          </span>
        ) : null}
      </div>
    </div>
  );
}
