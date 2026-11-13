import { o as categoryLabel, s as formatDate } from "./infratrack-BZipgbjk.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as require_jsx_runtime } from "../_libs/@radix-ui/react-label+[...].mjs";
import { n as useAuth } from "./useAuth-DIts1sgr.mjs";
import { t as RequireAuth } from "./RequireAuth-BtytK1xd.mjs";
import { t as Button } from "./button-DRsC1qZi.mjs";
import { _ as CircleCheck, f as FileText, m as Clock, u as LoaderCircle } from "../_libs/lucide-react.mjs";
import { t as AppShell } from "./AppShell-WtwtyNzz.mjs";
import { t as fetchComplaints } from "./complaints-l8toGHjo.mjs";
import { n as StatusBadge, t as PriorityBadge } from "./Badges-DnWDqIP6.mjs";
import { t as StatCard } from "./StatCard-LVLYL12a.mjs";
import { t as MapPanel } from "./MapPanel-GVA0RwDS.mjs";
import { t as useQuery } from "../_libs/tanstack__react-query.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/dashboard-C1yHkM6H.js
var import_jsx_runtime = require_jsx_runtime();
function Dashboard() {
	const { user, profile } = useAuth();
	const { data: mine = [], isLoading } = useQuery({
		queryKey: [
			"complaints",
			"mine",
			user?.id
		],
		queryFn: () => fetchComplaints({ userId: user.id }),
		enabled: !!user
	});
	const count = (s) => mine.filter((c) => c.status === s).length;
	const recent = mine.slice(0, 5);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-xl border bg-card p-5 shadow-card",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
						className: "font-display text-xl font-semibold",
						children: ["Welcome, ", profile?.full_name || "citizen"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-muted-foreground",
						children: "Spotted a pothole, a dark street or an overflowing drain? Report it in under a minute."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/report",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							className: "mt-4",
							children: "Report an issue"
						})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 sm:grid-cols-2 xl:grid-cols-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Total reported",
						value: mine.length,
						icon: FileText
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Pending",
						value: count("pending"),
						icon: Clock,
						tone: "accent"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "In progress",
						value: count("assigned") + count("in_progress"),
						icon: LoaderCircle,
						tone: "info"
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
						children: "Recent complaints"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/my-complaints",
						className: "text-sm text-primary hover:underline",
						children: "View all"
					})]
				}), isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "p-5 text-sm text-muted-foreground",
					children: "Loading…"
				}) : recent.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "p-5 text-sm text-muted-foreground",
					children: "No complaints yet."
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "divide-y",
					children: recent.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
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
			mine.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "mb-3 font-medium",
				children: "Your reports on the map"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPanel, {
				complaints: mine,
				height: "420px"
			})] }) : null
		]
	});
}
var SplitComponent = () => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RequireAuth, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, {
	title: "Dashboard",
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dashboard, {})
}) });
//#endregion
export { SplitComponent as component };
