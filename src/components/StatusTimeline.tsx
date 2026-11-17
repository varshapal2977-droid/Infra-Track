import { Check, CheckCircle2, Clock, FileCheck2, HardHat, UserCheck, XCircle } from "lucide-react";
import { STATUS_FLOW, formatDateTime, statusLabel } from "@/lib/infratrack";
import { cn } from "@/lib/utils";

export type HistoryRow = {
  id: string;
  new_status: string;
  old_status: string | null;
  remarks: string | null;
  changed_at: string;
};

const stepIcons: Record<string, typeof Check> = {
  pending: FileCheck2,
  assigned: UserCheck,
  in_progress: HardHat,
  resolved: CheckCircle2,
};

export function StatusTimeline({
  status,
  history,
}: {
  status: string;
  history: HistoryRow[];
}) {
  if (status === "rejected") {
    const rejected = history.find((h) => h.new_status === "rejected");
    return (
      <div className="rounded-xl border border-destructive/25 bg-destructive/5 p-4.5">
        <div className="flex items-center gap-2">
          <XCircle className="h-5 w-5 text-destructive" />
          <p className="font-semibold text-destructive">Complaint Rejected</p>
        </div>
        <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
          {rejected?.remarks || "This complaint was reviewed and closed by the municipal authority."}
        </p>
        <p className="mt-3 font-mono text-xs text-muted-foreground">
          {formatDateTime(rejected?.changed_at)}
        </p>
      </div>
    );
  }

  const currentIndex = STATUS_FLOW.indexOf(status as (typeof STATUS_FLOW)[number]);

  return (
    <ol className="relative space-y-1">
      {STATUS_FLOW.map((step, i) => {
        const isPast = i < currentIndex;
        const isCurrent = i === currentIndex;
        const reached = i <= currentIndex;
        const entry = [...history].reverse().find((h) => h.new_status === step);
        const Icon = stepIcons[step] ?? Check;

        return (
          <li key={step} className="group flex gap-3.5">
            <div className="flex flex-col items-center">
              <span
                className={cn(
                  "relative flex h-8 w-8 items-center justify-center rounded-full border text-xs font-semibold transition-all duration-200",
                  isCurrent
                    ? "border-primary bg-primary text-primary-foreground shadow-sm ring-4 ring-primary/15"
                    : isPast
                      ? "border-primary/80 bg-primary/90 text-primary-foreground"
                      : "border-border bg-muted/60 text-muted-foreground",
                )}
              >
                {isPast ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Icon className="h-4 w-4" />
                )}
              </span>
              {i < STATUS_FLOW.length - 1 ? (
                <span
                  className={cn(
                    "my-1.5 w-0.5 flex-1 min-h-6 transition-colors duration-200",
                    i < currentIndex ? "bg-primary" : "bg-border/80",
                  )}
                />
              ) : null}
            </div>
            <div className="flex-1 pb-6">
              <div className="flex flex-wrap items-baseline justify-between gap-1">
                <p
                  className={cn(
                    "text-sm font-semibold tracking-tight",
                    isCurrent
                      ? "text-primary"
                      : reached
                        ? "text-foreground"
                        : "text-muted-foreground",
                  )}
                >
                  {step === "pending" ? "Submitted by Citizen" : statusLabel(step)}
                </p>
                {entry ? (
                  <span className="font-mono text-xs text-muted-foreground">
                    {formatDateTime(entry.changed_at)}
                  </span>
                ) : (
                  <span className="text-xs text-muted-foreground/60 italic">Awaiting</span>
                )}
              </div>

              {entry?.remarks ? (
                <div className="mt-2 rounded-xl border border-border/80 bg-muted/40 p-3 text-xs text-foreground/90">
                  <span className="font-semibold text-primary">Authority note: </span>
                  {entry.remarks}
                </div>
              ) : null}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
