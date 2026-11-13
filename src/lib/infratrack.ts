// Shared domain constants for InfraTrack (categories, statuses, priorities,
// and the category -> department routing rules).

export type Category =
  | "road_pothole"
  | "streetlight"
  | "drainage"
  | "garbage"
  | "water_leakage"
  | "traffic_signage"
  | "public_property"
  | "other";

export type Status = "pending" | "assigned" | "in_progress" | "resolved" | "rejected";
export type Priority = "low" | "medium" | "high";

export const CATEGORIES: { value: Category; label: string }[] = [
  { value: "road_pothole", label: "Road / Pothole" },
  { value: "streetlight", label: "Streetlight" },
  { value: "drainage", label: "Drainage" },
  { value: "garbage", label: "Garbage / Sanitation" },
  { value: "water_leakage", label: "Water Leakage" },
  { value: "traffic_signage", label: "Traffic / Signage" },
  { value: "public_property", label: "Public Property" },
  { value: "other", label: "Other" },
];

export const STATUSES: { value: Status; label: string }[] = [
  { value: "pending", label: "Pending" },
  { value: "assigned", label: "Assigned" },
  { value: "in_progress", label: "In Progress" },
  { value: "resolved", label: "Resolved" },
  { value: "rejected", label: "Rejected" },
];

export const PRIORITIES: { value: Priority; label: string }[] = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
];

export const categoryLabel = (c: string) =>
  CATEGORIES.find((x) => x.value === c)?.label ?? c;
export const statusLabel = (s: string) => STATUSES.find((x) => x.value === s)?.label ?? s;
export const priorityLabel = (p: string) => PRIORITIES.find((x) => x.value === p)?.label ?? p;

/** Department automatically suggested for a category. */
export const DEPARTMENT_FOR_CATEGORY: Record<Category, string> = {
  road_pothole: "Roads Department",
  streetlight: "Electrical Department",
  drainage: "Drainage Department",
  garbage: "Sanitation Department",
  water_leakage: "Water Department",
  traffic_signage: "Public Works Department",
  public_property: "Public Works Department",
  other: "Public Works Department",
};

const URGENT_WORDS = [
  "danger",
  "accident",
  "hazard",
  "open manhole",
  "overflow",
  "sewage",
  "collapse",
  "major",
  "large",
  "urgent",
  "flood",
  "leak",
];

/** Simple rule-based priority suggestion from category + text. */
export function suggestPriority(category: Category, text: string): Priority {
  const t = text.toLowerCase();
  const urgent = URGENT_WORDS.some((w) => t.includes(w));
  const highBase: Category[] = ["drainage", "water_leakage", "road_pothole"];
  const lowBase: Category[] = ["public_property", "other"];
  if (urgent) return "high";
  if (highBase.includes(category)) return "medium";
  if (lowBase.includes(category)) return "low";
  return "medium";
}

export const STATUS_FLOW: Status[] = ["pending", "assigned", "in_progress", "resolved"];

export function formatDate(value?: string | null) {
  if (!value) return "—";
  return new Date(value).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function formatDateTime(value?: string | null) {
  if (!value) return "—";
  return new Date(value).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
