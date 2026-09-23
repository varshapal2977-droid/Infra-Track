import { Check } from "lucide-react";
import { STATUS_FLOW, formatDateTime, statusLabel } from "@/lib/infratrack";
import { cn } from "@/lib/utils";

export type HistoryRow = {
  id: string;
  new_status: string;
  old_status: string | null;
  remarks: string | null;
  changed_at: string;
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
      <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4">
        <p className="font-medium text-destructive">Complaint rejected</p>
        <p className="mt-1 text-sm text-muted-foreground">
          {rejected?.remarks || "This complaint was reviewed and closed by the authority."}
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          {formatDateTime(rejected?.changed_at)}
        </p>
      </div>
    );
  }

  const currentIndex = STATUS_FLOW.indexOf(status as (typeof STATUS_FLOW)[number]);

  return (
    <ol className="space-y-0">
      {STATUS_FLOW.map((step, i) => {
        const reached = i <= currentIndex;
        const entry = [...history].reverse().find((h) => h.new_status === step);
        return (
          <li key={step} className="flex gap-3">
            <div className="flex flex-col items-center">
              <span
                className={cn(
                  "flex h-7 w-7 items-center justify-center rounded-full border text-xs font-semibold",
                  reached
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-muted text-muted-foreground",
                )}
              >
                {reached ? <Check className="h-3.5 w-3.5" /> : i + 1}
              </span>
              {i < STATUS_FLOW.length - 1 ? (
                <span
                  className={cn(
                    "my-1 w-px flex-1",
                    i < currentIndex ? "bg-primary" : "bg-border",
                  )}
                />
              ) : null}
            </div>
            <div className="pb-6">
              <p className={cn("font-medium", !reached && "text-muted-foreground")}>
                {step === "pending" ? "Submitted" : statusLabel(step)}
              </p>
              <p className="text-xs text-muted-foreground">
                {entry ? formatDateTime(entry.changed_at) : "Awaiting update"}
              </p>
              {entry?.remarks ? (
                <p className="mt-1 text-sm text-muted-foreground">{entry.remarks}</p>
              ) : null}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
