//#region node_modules/.nitro/vite/services/ssr/assets/infratrack-BZipgbjk.js
var CATEGORIES = [
	{
		value: "road_pothole",
		label: "Road / Pothole"
	},
	{
		value: "streetlight",
		label: "Streetlight"
	},
	{
		value: "drainage",
		label: "Drainage"
	},
	{
		value: "garbage",
		label: "Garbage / Sanitation"
	},
	{
		value: "water_leakage",
		label: "Water Leakage"
	},
	{
		value: "traffic_signage",
		label: "Traffic / Signage"
	},
	{
		value: "public_property",
		label: "Public Property"
	},
	{
		value: "other",
		label: "Other"
	}
];
var STATUSES = [
	{
		value: "pending",
		label: "Pending"
	},
	{
		value: "assigned",
		label: "Assigned"
	},
	{
		value: "in_progress",
		label: "In Progress"
	},
	{
		value: "resolved",
		label: "Resolved"
	},
	{
		value: "rejected",
		label: "Rejected"
	}
];
var PRIORITIES = [
	{
		value: "low",
		label: "Low"
	},
	{
		value: "medium",
		label: "Medium"
	},
	{
		value: "high",
		label: "High"
	}
];
var categoryLabel = (c) => CATEGORIES.find((x) => x.value === c)?.label ?? c;
var statusLabel = (s) => STATUSES.find((x) => x.value === s)?.label ?? s;
var priorityLabel = (p) => PRIORITIES.find((x) => x.value === p)?.label ?? p;
/** Department automatically suggested for a category. */
var DEPARTMENT_FOR_CATEGORY = {
	road_pothole: "Roads Department",
	streetlight: "Electrical Department",
	drainage: "Drainage Department",
	garbage: "Sanitation Department",
	water_leakage: "Water Department",
	traffic_signage: "Public Works Department",
	public_property: "Public Works Department",
	other: "Public Works Department"
};
var URGENT_WORDS = [
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
	"leak"
];
/** Simple rule-based priority suggestion from category + text. */
function suggestPriority(category, text) {
	const t = text.toLowerCase();
	const urgent = URGENT_WORDS.some((w) => t.includes(w));
	const highBase = [
		"drainage",
		"water_leakage",
		"road_pothole"
	];
	const lowBase = ["public_property", "other"];
	if (urgent) return "high";
	if (highBase.includes(category)) return "medium";
	if (lowBase.includes(category)) return "low";
	return "medium";
}
var STATUS_FLOW = [
	"pending",
	"assigned",
	"in_progress",
	"resolved"
];
function formatDate(value) {
	if (!value) return "—";
	return new Date(value).toLocaleDateString("en-IN", {
		day: "2-digit",
		month: "short",
		year: "numeric"
	});
}
function formatDateTime(value) {
	if (!value) return "—";
	return new Date(value).toLocaleString("en-IN", {
		day: "2-digit",
		month: "short",
		year: "numeric",
		hour: "2-digit",
		minute: "2-digit"
	});
}
//#endregion
export { STATUS_FLOW as a, formatDateTime as c, suggestPriority as d, STATUSES as i, priorityLabel as l, DEPARTMENT_FOR_CATEGORY as n, categoryLabel as o, PRIORITIES as r, formatDate as s, CATEGORIES as t, statusLabel as u };
