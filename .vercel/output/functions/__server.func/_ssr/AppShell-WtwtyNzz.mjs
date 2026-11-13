import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { _ as useNavigate, g as Link, l as useRouterState } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as require_jsx_runtime } from "../_libs/@radix-ui/react-label+[...].mjs";
import { t as supabase } from "./client-DdbXR2jE.mjs";
import { n as useAuth } from "./useAuth-DIts1sgr.mjs";
import { n as cn, t as Button } from "./button-DRsC1qZi.mjs";
import { a as ShieldCheck, b as Building2, d as LayoutDashboard, f as FileText, g as CirclePlus, h as ClipboardList, l as LogOut, n as User, o as Menu, s as Map, x as Bell, y as ChartColumn } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/AppShell-WtwtyNzz.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var citizenNav = [
	{
		to: "/dashboard",
		label: "Dashboard",
		icon: LayoutDashboard
	},
	{
		to: "/report",
		label: "Report an Issue",
		icon: CirclePlus
	},
	{
		to: "/my-complaints",
		label: "My Complaints",
		icon: FileText
	},
	{
		to: "/map",
		label: "Infrastructure Map",
		icon: Map
	},
	{
		to: "/notifications",
		label: "Notifications",
		icon: Bell
	},
	{
		to: "/profile",
		label: "Profile",
		icon: User
	}
];
var adminNav = [
	{
		to: "/admin",
		label: "Admin Dashboard",
		icon: LayoutDashboard
	},
	{
		to: "/admin/complaints",
		label: "Manage Complaints",
		icon: ClipboardList
	},
	{
		to: "/admin/analytics",
		label: "Analytics",
		icon: ChartColumn
	},
	{
		to: "/admin/departments",
		label: "Departments",
		icon: Building2
	},
	{
		to: "/map",
		label: "Infrastructure Map",
		icon: Map
	},
	{
		to: "/notifications",
		label: "Notifications",
		icon: Bell
	},
	{
		to: "/profile",
		label: "Profile",
		icon: User
	}
];
function AppShell({ children, title }) {
	const { profile, isAdmin, signOut, user } = useAuth();
	const navigate = useNavigate();
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	const [open, setOpen] = (0, import_react.useState)(false);
	const [unread, setUnread] = (0, import_react.useState)(0);
	(0, import_react.useEffect)(() => {
		if (!user) return;
		supabase.from("notifications").select("id", {
			count: "exact",
			head: true
		}).eq("is_read", false).then(({ count }) => setUnread(count ?? 0));
	}, [user, pathname]);
	const sidebar = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
		className: "flex h-full w-64 flex-col bg-sidebar text-sidebar-foreground",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/",
				className: "flex items-center gap-2 px-5 py-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "rounded-md bg-sidebar-primary p-1.5 text-sidebar-primary-foreground",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "h-5 w-5" })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "font-display text-lg font-semibold tracking-tight",
					children: "InfraTrack"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
				className: "flex-1 space-y-1 px-3",
				children: (isAdmin ? adminNav : citizenNav).map((item) => {
					const active = pathname === item.to || pathname.startsWith(item.to + "/");
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: item.to,
						onClick: () => setOpen(false),
						className: cn("flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors", active ? "bg-sidebar-accent font-medium text-sidebar-accent-foreground" : "text-sidebar-foreground/80 hover:bg-sidebar-accent/60"),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(item.icon, { className: "h-4 w-4" }),
							item.label,
							item.label === "Notifications" && unread > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "ml-auto rounded-full bg-sidebar-primary px-2 text-xs font-semibold text-sidebar-primary-foreground",
								children: unread
							}) : null
						]
					}, item.to);
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "border-t border-sidebar-border p-4 text-sm",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-medium",
						children: profile?.full_name || "Citizen"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "truncate text-xs text-sidebar-foreground/70",
						children: profile?.email
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-xs text-sidebar-primary",
						children: isAdmin ? "Authority" : "Citizen"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: async () => {
							await signOut();
							navigate({
								to: "/",
								replace: true
							});
						},
						className: "mt-3 flex items-center gap-2 text-xs text-sidebar-foreground/80 hover:text-sidebar-foreground",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { className: "h-3.5 w-3.5" }), " Sign out"]
					})
				]
			})
		]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-screen bg-background",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "hidden md:block",
				children: sidebar
			}),
			open ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "fixed inset-0 z-50 flex md:hidden",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "h-full",
					children: sidebar
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					className: "flex-1 bg-foreground/40",
					onClick: () => setOpen(false),
					"aria-label": "Close menu"
				})]
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex min-w-0 flex-1 flex-col",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
					className: "flex items-center gap-3 border-b bg-card px-4 py-3 md:px-8",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "ghost",
							size: "icon",
							className: "md:hidden",
							onClick: () => setOpen(true),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, { className: "h-5 w-5" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "font-display text-xl font-semibold",
							children: title
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "ml-auto flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/notifications",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "ghost",
									size: "icon",
									"aria-label": "Notifications",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bell, { className: "h-5 w-5" })
								})
							}), !isAdmin ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/report",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									size: "sm",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CirclePlus, { className: "mr-1.5 h-4 w-4" }), " Report"]
								})
							}) : null]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
					className: "flex-1 p-4 md:p-8",
					children
				})]
			})
		]
	});
}
//#endregion
export { AppShell as t };
