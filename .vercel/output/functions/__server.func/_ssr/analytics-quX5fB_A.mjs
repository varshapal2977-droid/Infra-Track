import { i as __toESM } from "../_runtime.mjs";
import { i as STATUSES, o as categoryLabel, t as CATEGORIES, u as statusLabel } from "./infratrack-BZipgbjk.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { i as require_jsx_runtime } from "../_libs/@radix-ui/react-label+[...].mjs";
import { t as RequireAuth } from "./RequireAuth-BtytK1xd.mjs";
import { t as AppShell } from "./AppShell-WtwtyNzz.mjs";
import { n as fetchDepartments, t as fetchComplaints } from "./complaints-l8toGHjo.mjs";
import { t as useQuery } from "../_libs/tanstack__react-query.mjs";
import { a as XAxis, c as Bar, d as ResponsiveContainer, f as Tooltip, i as YAxis, l as Pie, n as BarChart, o as Line, p as Legend, r as LineChart, s as CartesianGrid, t as PieChart, u as Cell } from "../_libs/recharts+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/analytics-quX5fB_A.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var COLORS = [
	"hsl(var(--chart-1, 190 70% 35%))",
	"#0f766e",
	"#f59e0b",
	"#2563eb",
	"#dc2626",
	"#7c3aed",
	"#059669",
	"#64748b"
];
function Analytics() {
	const { data: complaints = [], isLoading } = useQuery({
		queryKey: ["complaints", "all"],
		queryFn: () => fetchComplaints()
	});
	const { data: departments = [] } = useQuery({
		queryKey: ["departments"],
		queryFn: fetchDepartments
	});
	const byCategory = (0, import_react.useMemo)(() => CATEGORIES.map((c) => ({
		name: categoryLabel(c.value),
		count: complaints.filter((x) => x.category === c.value).length
	})).filter((r) => r.count > 0), [complaints]);
	const byStatus = (0, import_react.useMemo)(() => STATUSES.map((s) => ({
		name: statusLabel(s.value),
		value: complaints.filter((x) => x.status === s.value).length
	})).filter((r) => r.value > 0), [complaints]);
	const byDepartment = (0, import_react.useMemo)(() => departments.map((d) => ({
		name: d.name.replace(" Department", ""),
		open: complaints.filter((c) => c.department_id === d.id && c.status !== "resolved" && c.status !== "rejected").length,
		resolved: complaints.filter((c) => c.department_id === d.id && c.status === "resolved").length
	})), [complaints, departments]);
	const monthly = (0, import_react.useMemo)(() => {
		const map = /* @__PURE__ */ new Map();
		for (let i = 5; i >= 0; i--) {
			const d = /* @__PURE__ */ new Date();
			d.setMonth(d.getMonth() - i, 1);
			const key = `${d.getFullYear()}-${d.getMonth()}`;
			map.set(key, {
				name: d.toLocaleDateString("en-IN", { month: "short" }),
				reported: 0,
				resolved: 0
			});
		}
		for (const c of complaints) {
			const d = new Date(c.created_at);
			const row = map.get(`${d.getFullYear()}-${d.getMonth()}`);
			if (row) row.reported += 1;
			if (c.resolved_at) {
				const r = new Date(c.resolved_at);
				const rrow = map.get(`${r.getFullYear()}-${r.getMonth()}`);
				if (rrow) rrow.resolved += 1;
			}
		}
		return [...map.values()];
	}, [complaints]);
	const avgResolutionDays = (0, import_react.useMemo)(() => {
		const done = complaints.filter((c) => c.resolved_at);
		if (done.length === 0) return "—";
		return `${(done.reduce((sum, c) => sum + (new Date(c.resolved_at).getTime() - new Date(c.created_at).getTime()) / 864e5, 0) / done.length).toFixed(1)} days`;
	}, [complaints]);
	const resolutionRate = complaints.length === 0 ? "—" : `${Math.round(complaints.filter((c) => c.status === "resolved").length / complaints.length * 100)}%`;
	if (isLoading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-sm text-muted-foreground",
		children: "Loading analytics…"
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-4 sm:grid-cols-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl border bg-card p-5 shadow-card",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted-foreground",
						children: "Total complaints"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-display text-3xl font-semibold",
						children: complaints.length
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl border bg-card p-5 shadow-card",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted-foreground",
						children: "Resolution rate"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-display text-3xl font-semibold",
						children: resolutionRate
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl border bg-card p-5 shadow-card",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted-foreground",
						children: "Average time to resolve"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-display text-3xl font-semibold",
						children: avgResolutionDays
					})]
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-6 xl:grid-cols-2",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartCard, {
					title: "Complaints by category",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BarChart, {
						data: byCategory,
						margin: {
							left: -20,
							bottom: 40
						},
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
								strokeDasharray: "3 3",
								vertical: false
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
								dataKey: "name",
								angle: -30,
								textAnchor: "end",
								interval: 0,
								fontSize: 11
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
								allowDecimals: false,
								fontSize: 11
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
								dataKey: "count",
								fill: "#0f766e",
								radius: [
									4,
									4,
									0,
									0
								]
							})
						]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartCard, {
					title: "Status breakdown",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PieChart, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pie, {
							data: byStatus,
							dataKey: "value",
							nameKey: "name",
							outerRadius: 110,
							label: true,
							children: byStatus.map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cell, { fill: COLORS[i % COLORS.length] }, i))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Legend, {})
					] })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartCard, {
					title: "Department workload",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BarChart, {
						data: byDepartment,
						margin: {
							left: -20,
							bottom: 30
						},
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
								strokeDasharray: "3 3",
								vertical: false
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
								dataKey: "name",
								angle: -20,
								textAnchor: "end",
								interval: 0,
								fontSize: 11
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
								allowDecimals: false,
								fontSize: 11
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Legend, {}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
								dataKey: "open",
								stackId: "a",
								fill: "#f59e0b"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
								dataKey: "resolved",
								stackId: "a",
								fill: "#0f766e",
								radius: [
									4,
									4,
									0,
									0
								]
							})
						]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartCard, {
					title: "Reported vs resolved (last 6 months)",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(LineChart, {
						data: monthly,
						margin: { left: -20 },
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
								strokeDasharray: "3 3",
								vertical: false
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
								dataKey: "name",
								fontSize: 11
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
								allowDecimals: false,
								fontSize: 11
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Legend, {}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
								type: "monotone",
								dataKey: "reported",
								stroke: "#2563eb",
								strokeWidth: 2
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
								type: "monotone",
								dataKey: "resolved",
								stroke: "#0f766e",
								strokeWidth: 2
							})
						]
					})
				})
			]
		})]
	});
}
function ChartCard({ title, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-xl border bg-card p-5 shadow-card",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
			className: "mb-4 font-medium",
			children: title
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "h-80",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
				width: "100%",
				height: "100%",
				children
			})
		})]
	});
}
var SplitComponent = () => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RequireAuth, {
	admin: true,
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, {
		title: "Analytics",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Analytics, {})
	})
});
//#endregion
export { SplitComponent as component };
