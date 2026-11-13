import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as require_jsx_runtime } from "../_libs/@radix-ui/react-label+[...].mjs";
import { n as useAuth } from "./useAuth-DIts1sgr.mjs";
import { t as Button } from "./button-DRsC1qZi.mjs";
import { a as ShieldCheck, c as MapPin, i as Siren, t as Workflow, y as ChartColumn } from "../_libs/lucide-react.mjs";
import { t as fetchComplaints } from "./complaints-l8toGHjo.mjs";
import { t as useQuery } from "../_libs/tanstack__react-query.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-BMjV-zjz.js
var import_jsx_runtime = require_jsx_runtime();
function Landing() {
	const { user, isAdmin } = useAuth();
	const { data: complaints = [] } = useQuery({
		queryKey: ["complaints", "public"],
		queryFn: () => fetchComplaints()
	});
	const resolved = complaints.filter((c) => c.status === "resolved").length;
	const open = complaints.length - resolved;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-background",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "flex items-center gap-3 border-b bg-card px-4 py-4 md:px-10",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "rounded-md bg-primary p-1.5 text-primary-foreground",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "h-5 w-5" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-display text-lg font-semibold",
						children: "InfraTrack"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
						className: "ml-auto flex items-center gap-2 text-sm",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/map",
								className: "hidden px-3 py-2 hover:text-primary sm:block",
								children: "City Map"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/about",
								className: "hidden px-3 py-2 hover:text-primary sm:block",
								children: "About"
							}),
							user ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: isAdmin ? "/admin" : "/dashboard",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									size: "sm",
									children: "Go to dashboard"
								})
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/login",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "ghost",
									size: "sm",
									children: "Sign in"
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/register",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									size: "sm",
									children: "Create account"
								})
							})] })
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mx-auto grid max-w-6xl gap-10 px-4 py-14 md:grid-cols-2 md:px-10 md:py-20",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-semibold tracking-widest text-accent-foreground uppercase",
						children: "Civic infrastructure platform"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "mt-3 font-display text-4xl leading-tight font-semibold md:text-5xl",
						children: "Report city issues. Watch them get fixed."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-4 text-muted-foreground",
						children: "Potholes, broken streetlights, blocked drains, garbage and water leaks — pin the exact location, send it to the right department and follow every status update until resolution."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-7 flex flex-wrap gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/report",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "lg",
								children: "Report an issue"
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/map",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "lg",
								variant: "outline",
								children: "Explore the map"
							})
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-9 grid grid-cols-3 gap-4 text-center",
						children: [
							{
								label: "Complaints",
								value: complaints.length
							},
							{
								label: "Resolved",
								value: resolved
							},
							{
								label: "In queue",
								value: open
							}
						].map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-xl border bg-card p-4 shadow-card",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-display text-2xl font-semibold",
								children: s.value
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted-foreground",
								children: s.label
							})]
						}, s.label))
					})
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid gap-4 self-start sm:grid-cols-2",
					children: [
						{
							icon: MapPin,
							title: "Pin-point reporting",
							body: "Drop a marker on the map or use your current location with the full address."
						},
						{
							icon: Workflow,
							title: "Smart routing",
							body: "Each category is routed to the right department with a suggested priority."
						},
						{
							icon: Siren,
							title: "Live status trail",
							body: "Pending, Assigned, In Progress, Resolved — with remarks at every step."
						},
						{
							icon: ChartColumn,
							title: "Open analytics",
							body: "Category trends, department load and resolution rates for the whole city."
						}
					].map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-xl border bg-card p-5 shadow-card",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(f.icon, { className: "h-5 w-5 text-primary" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-3 font-medium",
								children: f.title
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-sm text-muted-foreground",
								children: f.body
							})
						]
					}, f.title))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("footer", {
				className: "border-t bg-card px-4 py-6 text-center text-sm text-muted-foreground md:px-10",
				children: "InfraTrack · A civic maintenance tracking platform"
			})
		]
	});
}
//#endregion
export { Landing as component };
