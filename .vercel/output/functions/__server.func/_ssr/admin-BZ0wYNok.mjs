import { o as categoryLabel, s as formatDate } from "./infratrack-BZipgbjk.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as require_jsx_runtime } from "../_libs/@radix-ui/react-label+[...].mjs";
import { t as RequireAuth } from "./RequireAuth-BtytK1xd.mjs";
import { _ as CircleCheck, f as FileText, m as Clock, r as TriangleAlert } from "../_libs/lucide-react.mjs";
import { t as AppShell } from "./AppShell-WtwtyNzz.mjs";
import { t as fetchComplaints } from "./complaints-l8toGHjo.mjs";
import { n as StatusBadge, t as PriorityBadge } from "./Badges-DnWDqIP6.mjs";
import { t as StatCard } from "./StatCard-LVLYL12a.mjs";
import { t as MapPanel } from "./MapPanel-GVA0RwDS.mjs";
import { t as useQuery } from "../_libs/tanstack__react-query.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin-BZ0wYNok.js
var import_jsx_runtime = require_jsx_runtime();
function AdminDashboard() {
	const { data = [], isLoading } = useQuery({
		queryKey: ["complaints", "all"],
		queryFn: () => fetchComplaints()
	});
	const count = (s) => data.filter((c) => c.status === s).length;
	const highOpen = data.filter((c) => c.priority === "high" && c.status !== "resolved");
	const latest = data.slice(0, 8);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 sm:grid-cols-2 xl:grid-cols-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Total complaints",
						value: data.length,
						icon: FileText
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Pending",
						value: count("pending"),
						icon: Clock,
						tone: "accent"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "High priority open",
						value: highOpen.length,
						icon: TriangleAlert,
						tone: "destructive"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Resolved",
						value: count("resolved"),
						icon: CircleCheck,
						tone: "success"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-xl border bg-card shadow-card",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between border-b px-5 py-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "font-medium",
						children: "Latest complaints"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/admin/complaints",
						className: "text-sm text-primary hover:underline",
						children: "Manage all"
					})]
				}), isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "p-5 text-sm text-muted-foreground",
					children: "Loading…"
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "divide-y",
					children: latest.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex flex-wrap items-center gap-3 px-5 py-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0 flex-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/complaints/$id",
									params: { id: c.id },
									className: "font-medium hover:text-primary",
									children: c.title
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-xs text-muted-foreground",
									children: [
										c.complaint_id,
										" · ",
										categoryLabel(c.category),
										" · ",
										c.area ?? c.address,
										" ·",
										" ",
										formatDate(c.created_at)
									]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PriorityBadge, { priority: c.priority }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { status: c.status })
						]
					}, c.id))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "mb-3 font-medium",
				children: "City map"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPanel, {
				complaints: data,
				height: "460px"
			})] })
		]
	});
}
var SplitComponent = () => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RequireAuth, {
	admin: true,
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, {
		title: "Admin Dashboard",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminDashboard, {})
	})
});
//#endregion
export { SplitComponent as component };
