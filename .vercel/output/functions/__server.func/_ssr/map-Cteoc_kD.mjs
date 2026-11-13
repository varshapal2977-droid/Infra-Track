import { i as __toESM } from "../_runtime.mjs";
import { i as STATUSES, r as PRIORITIES, t as CATEGORIES } from "./infratrack-BZipgbjk.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as require_jsx_runtime } from "../_libs/@radix-ui/react-label+[...].mjs";
import { n as useAuth } from "./useAuth-DIts1sgr.mjs";
import { t as Button } from "./button-DRsC1qZi.mjs";
import { a as ShieldCheck } from "../_libs/lucide-react.mjs";
import { t as AppShell } from "./AppShell-WtwtyNzz.mjs";
import { t as fetchComplaints } from "./complaints-l8toGHjo.mjs";
import { t as MapPanel } from "./MapPanel-GVA0RwDS.mjs";
import { t as useQuery } from "../_libs/tanstack__react-query.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/map-Cteoc_kD.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function MapRoute() {
	const { user } = useAuth();
	const content = /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapView, {});
	if (user) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, {
		title: "Infrastructure Map",
		children: content
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-background",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
			className: "flex items-center gap-3 border-b bg-card px-4 py-4 md:px-10",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/",
				className: "flex items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "rounded-md bg-primary p-1.5 text-primary-foreground",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "h-4 w-4" })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "font-display font-semibold",
					children: "InfraTrack"
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/login",
				className: "ml-auto",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					size: "sm",
					children: "Sign in to report"
				})
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "p-4 md:p-8",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mb-4 font-display text-2xl font-semibold",
				children: "Infrastructure Map"
			}), content]
		})]
	});
}
function MapView() {
	const { data: complaints = [] } = useQuery({
		queryKey: ["complaints", "public"],
		queryFn: () => fetchComplaints()
	});
	const [category, setCategory] = (0, import_react.useState)("all");
	const [status, setStatus] = (0, import_react.useState)("all");
	const [priority, setPriority] = (0, import_react.useState)("all");
	const [density, setDensity] = (0, import_react.useState)(false);
	const filtered = (0, import_react.useMemo)(() => complaints.filter((c) => (category === "all" || c.category === category) && (status === "all" || c.status === status) && (priority === "all" || c.priority === priority)), [
		complaints,
		category,
		status,
		priority
	]);
	const selectClass = "h-9 rounded-md border bg-background px-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-ring";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-wrap items-center gap-2 rounded-xl border bg-card p-3 shadow-card",
			children: [
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
					value: priority,
					onChange: (e) => setPriority(e.target.value),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: "all",
						children: "All priorities"
					}), PRIORITIES.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: p.value,
						children: p.label
					}, p.value))]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: density ? "default" : "outline",
					size: "sm",
					onClick: () => setDensity((d) => !d),
					children: density ? "Density on" : "Density off"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "ml-auto text-sm text-muted-foreground",
					children: [filtered.length, " issues"]
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPanel, {
			complaints: filtered,
			density,
			height: "70vh"
		})]
	});
}
//#endregion
export { MapRoute as component };
