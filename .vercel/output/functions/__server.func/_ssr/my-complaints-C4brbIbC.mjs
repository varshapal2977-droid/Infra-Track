import { i as __toESM } from "../_runtime.mjs";
import { i as STATUSES, o as categoryLabel, s as formatDate, t as CATEGORIES } from "./infratrack-BZipgbjk.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as require_jsx_runtime } from "../_libs/@radix-ui/react-label+[...].mjs";
import { n as useAuth } from "./useAuth-DIts1sgr.mjs";
import { t as RequireAuth } from "./RequireAuth-BtytK1xd.mjs";
import { t as AppShell } from "./AppShell-WtwtyNzz.mjs";
import { t as fetchComplaints } from "./complaints-l8toGHjo.mjs";
import { n as StatusBadge, t as PriorityBadge } from "./Badges-DnWDqIP6.mjs";
import { t as useQuery } from "../_libs/tanstack__react-query.mjs";
import { t as Input } from "./input-DicJzR9-.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/my-complaints-C4brbIbC.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function MyComplaints() {
	const { user } = useAuth();
	const { data = [], isLoading } = useQuery({
		queryKey: [
			"complaints",
			"mine",
			user?.id
		],
		queryFn: () => fetchComplaints({ userId: user.id }),
		enabled: !!user
	});
	const [q, setQ] = (0, import_react.useState)("");
	const [status, setStatus] = (0, import_react.useState)("all");
	const [category, setCategory] = (0, import_react.useState)("all");
	const rows = (0, import_react.useMemo)(() => data.filter((c) => (status === "all" || c.status === status) && (category === "all" || c.category === category) && (q === "" || `${c.title} ${c.description} ${c.address} ${c.complaint_id}`.toLowerCase().includes(q.toLowerCase()))), [
		data,
		q,
		status,
		category
	]);
	const selectClass = "h-10 rounded-md border bg-background px-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-ring";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-wrap gap-2 rounded-xl border bg-card p-3 shadow-card",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					className: "max-w-xs",
					placeholder: "Search title, ID or address",
					value: q,
					onChange: (e) => setQ(e.target.value)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
					className: selectClass,
					value: status,
					onChange: (e) => setStatus(e.target.value),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: "all",
						children: "All statuses"
					}), STATUSES.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: s.value,
						children: s.label
					}, s.value))]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
					className: selectClass,
					value: category,
					onChange: (e) => setCategory(e.target.value),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: "all",
						children: "All categories"
					}), CATEGORIES.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: c.value,
						children: c.label
					}, c.value))]
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "overflow-x-auto rounded-xl border bg-card shadow-card",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
				className: "w-full text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
					className: "bg-muted/50 text-left text-xs tracking-wide text-muted-foreground uppercase",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-4 py-3",
							children: "ID"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-4 py-3",
							children: "Issue"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-4 py-3",
							children: "Category"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-4 py-3",
							children: "Priority"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-4 py-3",
							children: "Status"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-4 py-3",
							children: "Reported"
						})
					] })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
					className: "divide-y",
					children: isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						colSpan: 6,
						className: "px-4 py-6 text-muted-foreground",
						children: "Loading…"
					}) }) : rows.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						colSpan: 6,
						className: "px-4 py-6 text-muted-foreground",
						children: "No complaints found."
					}) }) : rows.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
						className: "hover:bg-muted/40",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-4 py-3 font-mono text-xs",
								children: c.complaint_id
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
								className: "px-4 py-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/complaints/$id",
									params: { id: c.id },
									className: "font-medium hover:text-primary",
									children: c.title
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-muted-foreground",
									children: c.address
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-4 py-3",
								children: categoryLabel(c.category)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-4 py-3",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PriorityBadge, { priority: c.priority })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-4 py-3",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { status: c.status })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-4 py-3 whitespace-nowrap",
								children: formatDate(c.created_at)
							})
						]
					}, c.id))
				})]
			})
		})]
	});
}
var SplitComponent = () => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RequireAuth, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, {
	title: "My Complaints",
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MyComplaints, {})
}) });
//#endregion
export { SplitComponent as component };
