import { cn } from "@/lib/utils";
import { priorityLabel, statusLabel } from "@/lib/infratrack";
import { useLanguage } from "@/context/LanguageContext";
import { AlertTriangle, ArrowUpRight, CheckCircle2, Clock, ShieldAlert } from "lucide-react";

interface BadgeConfig {
  pill: string;
  dot: string;
  pulse?: boolean;
}

const statusConfig: Record<string, BadgeConfig> = {
  pending: {
    pill: "bg-muted/80 text-muted-foreground border-border/80",
    dot: "bg-muted-foreground/60",
    pulse: false,
  },
  assigned: {
    pill: "bg-info/10 text-info border-info/25 font-medium",
    dot: "bg-info",
    pulse: true,
  },
  in_progress: {
    pill: "bg-warning/15 text-accent-foreground border-warning/35 font-medium",
    dot: "bg-warning",
    pulse: true,
  },
  resolved: {
    pill: "bg-success/12 text-success border-success/30 font-medium",
    dot: "bg-success",
    pulse: false,
  },
  rejected: {
    pill: "bg-destructive/10 text-destructive border-destructive/25 font-medium",
    dot: "bg-destructive",
    pulse: false,
  },
};

const priorityConfig: Record<string, { pill: string; icon: typeof AlertTriangle }> = {
  low: {
    pill: "bg-muted text-muted-foreground border-border/70",
    icon: Clock,
  },
  medium: {
    pill: "bg-info/10 text-info border-info/30 font-medium",
    icon: ArrowUpRight,
  },
  high: {
    pill: "bg-destructive/10 text-destructive border-destructive/30 font-semibold shadow-2xs",
    icon: AlertTriangle,
  },
};

export const StatusBadge = ({ status }: { status: string }) => {
  const { language } = useLanguage();
  const conf = statusConfig[status] ?? statusConfig["pending"];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs tracking-tight transition-colors whitespace-nowrap",
        conf.pill,
      )}
    >
      <span className="relative flex h-1.5 w-1.5">
        {conf.pulse ? (
          <span
            className={cn(
              "absolute inline-flex h-full w-full animate-ping rounded-full opacity-75",
              conf.dot,
            )}
          />
        ) : null}
        <span className={cn("relative inline-flex h-1.5 w-1.5 rounded-full", conf.dot)} />
      </span>
      {statusLabel(status, language)}
    </span>
  );
};

export const PriorityBadge = ({ priority }: { priority: string }) => {
  const { language } = useLanguage();
  const conf = priorityConfig[priority] ?? priorityConfig["low"];
  const Icon = conf.icon;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs transition-colors whitespace-nowrap",
        conf.pill,
      )}
    >
      <Icon className="h-3 w-3 shrink-0" />
      {priorityLabel(priority, language)}
    </span>
  );
};
