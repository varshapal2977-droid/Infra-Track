import { cn } from "@/lib/utils";
import { priorityLabel, statusLabel } from "@/lib/infratrack";

const statusStyles: Record<string, string> = {
  pending: "bg-muted text-muted-foreground border-border",
  assigned: "bg-info/10 text-info border-info/30",
  in_progress: "bg-warning/15 text-accent-foreground border-warning/40",
  resolved: "bg-success/12 text-success border-success/30",
  rejected: "bg-destructive/10 text-destructive border-destructive/30",
};

const priorityStyles: Record<string, string> = {
  low: "bg-muted text-muted-foreground border-border",
  medium: "bg-info/10 text-info border-info/30",
  high: "bg-destructive/10 text-destructive border-destructive/30",
};

function Pill({
  className,
  children,
}: {
  className?: string | undefined;
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium whitespace-nowrap",
        className,
      )}
    >
      {children}
    </span>
  );
}

export const StatusBadge = ({ status }: { status: string }) => (
  <Pill className={statusStyles[status] ?? statusStyles["pending"]}>{statusLabel(status)}</Pill>
);

export const PriorityBadge = ({ priority }: { priority: string }) => (
  <Pill className={priorityStyles[priority] ?? priorityStyles["low"]}>
    {priorityLabel(priority)}
  </Pill>
);
