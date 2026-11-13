import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { c as HeadContent, d as createRouter, f as Outlet, g as Link, h as createRootRouteWithContext, m as createFileRoute, p as lazyRouteComponent, s as Scripts, v as useRouter } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as require_jsx_runtime } from "../_libs/@radix-ui/react-label+[...].mjs";
import { t as AuthProvider } from "./useAuth-DIts1sgr.mjs";
import { n as QueryClientProvider } from "../_libs/tanstack__react-query.mjs";
import { t as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { t as Toaster } from "../_libs/sonner.mjs";
import { t as Route$15 } from "./complaints._id-BArt-d4y.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/router-Dvl7s2nW.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var styles_default = "/assets/styles-NutHssQY.css";
function reportLovableError(error, context = {}) {
	if (typeof window === "undefined") return;
	window.__lovableEvents?.captureException?.(error, {
		source: "react_error_boundary",
		route: window.location.pathname,
		...context
	}, {
		mechanism: "react_error_boundary",
		handled: false,
		severity: "error"
	});
	const message = error instanceof Response ? `Response ${error.status}${error.url ? ` at ${error.url}` : ""}` : error instanceof Error ? error.message : String(error);
	const stack = error instanceof Error ? error.stack : void 0;
	window.__lovableReportRuntimeError?.({
		message,
		...stack !== void 0 && { stack },
		filename: window.location.pathname
	});
}
var Toaster$1 = ({ ...props }) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster, {
		className: "toaster group",
		toastOptions: { classNames: {
			toast: "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
			description: "group-[.toast]:text-muted-foreground",
			actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
			cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground"
		} },
		...props
	});
};
function NotFoundComponent() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-7xl font-bold text-foreground",
					children: "404"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-4 text-xl font-semibold text-foreground",
					children: "Page not found"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "The page you're looking for doesn't exist or has been moved."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Go home"
					})
				})
			]
		})
	});
}
function ErrorComponent({ error, reset }) {
	console.error(error);
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		reportLovableError(error, { boundary: "tanstack_root_error_component" });
	}, [error]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-xl font-semibold tracking-tight text-foreground",
					children: "This page didn't load"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "Something went wrong on our end. You can try refreshing or head back home."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 flex flex-wrap justify-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => {
							router.invalidate();
							reset();
						},
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Try again"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: "/",
						className: "inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent",
						children: "Go home"
					})]
				})
			]
		})
	});
}
var Route$14 = createRootRouteWithContext()({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: "InfraTrack — Civic Infrastructure Complaints" },
			{
				name: "description",
				content: "Report, track and resolve public infrastructure issues across Indian cities with maps and analytics."
			},
			{
				property: "og:type",
				content: "website"
			},
			{
				name: "twitter:card",
				content: "summary_large_image"
			}
		],
		links: [{
			rel: "stylesheet",
			href: styles_default
		}, {
			rel: "icon",
			href: "/favicon.ico",
			type: "image/x-icon"
		}]
	}),
	shellComponent: RootShell,
	component: RootComponent,
	notFoundComponent: NotFoundComponent,
	errorComponent: ErrorComponent
});
function RootShell({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "en",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", { children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})] })]
	});
}
function RootComponent() {
	const { queryClient } = Route$14.useRouteContext();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QueryClientProvider, {
		client: queryClient,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AuthProvider, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster$1, {
			richColors: true,
			position: "top-right"
		})] })
	});
}
var $$splitComponentImporter$13 = () => import("./routes-BMjV-zjz.mjs");
var Route$13 = createFileRoute("/")({
	head: () => ({ meta: [
		{ title: "InfraTrack — Report & Track Civic Infrastructure Issues" },
		{
			name: "description",
			content: "InfraTrack lets citizens report potholes, streetlights, drainage and sanitation issues, and lets city authorities track resolution on a live map."
		},
		{
			property: "og:title",
			content: "InfraTrack — Civic Infrastructure Complaints"
		},
		{
			property: "og:description",
			content: "Report civic issues, follow their status and see city-wide resolution analytics."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$13, "component")
});
var $$splitComponentImporter$12 = () => import("./about-CVLXW97u.mjs");
var Route$12 = createFileRoute("/about")({
	head: () => ({ meta: [
		{ title: "About InfraTrack — How Civic Complaints Are Handled" },
		{
			name: "description",
			content: "How InfraTrack routes citizen complaints to city departments, tracks status changes and publishes resolution analytics."
		},
		{
			property: "og:title",
			content: "About InfraTrack"
		},
		{
			property: "og:description",
			content: "How citizen complaints move from report to resolution on InfraTrack."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$12, "component")
});
var $$splitComponentImporter$11 = () => import("./dashboard-C1yHkM6H.mjs");
var Route$11 = createFileRoute("/dashboard")({
	head: () => ({ meta: [
		{ title: "Your dashboard — InfraTrack" },
		{
			name: "description",
			content: "Your reported civic issues and their current status."
		},
		{
			property: "og:title",
			content: "Your dashboard — InfraTrack"
		},
		{
			property: "og:description",
			content: "Track the civic issues you reported."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$11, "component")
});
var $$splitComponentImporter$10 = () => import("./login-IZxiR216.mjs");
var Route$10 = createFileRoute("/login")({
	head: () => ({ meta: [
		{ title: "Sign in — InfraTrack" },
		{
			name: "description",
			content: "Sign in to report and track civic infrastructure issues."
		},
		{
			property: "og:title",
			content: "Sign in — InfraTrack"
		},
		{
			property: "og:description",
			content: "Access your InfraTrack complaints dashboard."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$10, "component")
});
var $$splitComponentImporter$9 = () => import("./map-Cteoc_kD.mjs");
var Route$9 = createFileRoute("/map")({
	head: () => ({ meta: [
		{ title: "City Infrastructure Map — InfraTrack" },
		{
			name: "description",
			content: "Live map of reported potholes, streetlights, drainage, garbage and water issues across the city."
		},
		{
			property: "og:title",
			content: "City Infrastructure Map — InfraTrack"
		},
		{
			property: "og:description",
			content: "See where civic issues are reported and which ones are still open."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$9, "component")
});
var $$splitComponentImporter$8 = () => import("./my-complaints-C4brbIbC.mjs");
var Route$8 = createFileRoute("/my-complaints")({
	head: () => ({ meta: [
		{ title: "My complaints — InfraTrack" },
		{
			name: "description",
			content: "All the civic issues you have reported and their status."
		},
		{
			property: "og:title",
			content: "My complaints — InfraTrack"
		},
		{
			property: "og:description",
			content: "Search and filter the issues you reported."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$8, "component")
});
var $$splitComponentImporter$7 = () => import("./notifications-cIWOrPoM.mjs");
var Route$7 = createFileRoute("/notifications")({
	head: () => ({ meta: [
		{ title: "Notifications — InfraTrack" },
		{
			name: "description",
			content: "Status updates on the civic issues you follow."
		},
		{
			property: "og:title",
			content: "Notifications — InfraTrack"
		},
		{
			property: "og:description",
			content: "Updates on your reported civic issues."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$7, "component")
});
var $$splitComponentImporter$6 = () => import("./profile-CdRDUy2E.mjs");
var Route$6 = createFileRoute("/profile")({
	head: () => ({ meta: [
		{ title: "Your profile — InfraTrack" },
		{
			name: "description",
			content: "Update your contact details and authority access."
		},
		{
			property: "og:title",
			content: "Your profile — InfraTrack"
		},
		{
			property: "og:description",
			content: "Manage your InfraTrack account details."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
var $$splitComponentImporter$5 = () => import("./register-D3vT5CFU.mjs");
var Route$5 = createFileRoute("/register")({
	head: () => ({ meta: [
		{ title: "Create an account — InfraTrack" },
		{
			name: "description",
			content: "Register on InfraTrack to report civic infrastructure issues in your city."
		},
		{
			property: "og:title",
			content: "Create an account — InfraTrack"
		},
		{
			property: "og:description",
			content: "Join InfraTrack and report issues in your area."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
var $$splitComponentImporter$4 = () => import("./report-CUNydPrm.mjs");
var Route$4 = createFileRoute("/report")({
	head: () => ({ meta: [
		{ title: "Report an issue — InfraTrack" },
		{
			name: "description",
			content: "Report a pothole, streetlight, drain, garbage or water issue with an exact location."
		},
		{
			property: "og:title",
			content: "Report an issue — InfraTrack"
		},
		{
			property: "og:description",
			content: "Send a civic issue straight to the right department."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
var $$splitComponentImporter$3 = () => import("./admin-BZ0wYNok.mjs");
var Route$3 = createFileRoute("/admin/")({
	head: () => ({ meta: [
		{ title: "Authority dashboard — InfraTrack" },
		{
			name: "description",
			content: "City-wide overview of civic complaints and their status."
		},
		{
			property: "og:title",
			content: "Authority dashboard — InfraTrack"
		},
		{
			property: "og:description",
			content: "Monitor and resolve reported infrastructure issues."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
var $$splitComponentImporter$2 = () => import("./analytics-quX5fB_A.mjs");
var Route$2 = createFileRoute("/admin/analytics")({
	head: () => ({ meta: [
		{ title: "Analytics — InfraTrack" },
		{
			name: "description",
			content: "Charts on complaint volume, categories and resolution times."
		},
		{
			property: "og:title",
			content: "Analytics — InfraTrack"
		},
		{
			property: "og:description",
			content: "Insights into civic complaint trends across the city."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
var $$splitComponentImporter$1 = () => import("./complaints-BHUEiip0.mjs");
var Route$1 = createFileRoute("/admin/complaints")({
	head: () => ({ meta: [
		{ title: "Manage complaints — InfraTrack" },
		{
			name: "description",
			content: "Assign departments, set priority and update complaint status."
		},
		{
			property: "og:title",
			content: "Manage complaints — InfraTrack"
		},
		{
			property: "og:description",
			content: "Authority workspace for resolving civic complaints."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
var $$splitComponentImporter = () => import("./departments-C3MGtxQZ.mjs");
var Route = createFileRoute("/admin/departments")({
	head: () => ({ meta: [
		{ title: "Departments — InfraTrack" },
		{
			name: "description",
			content: "Civic departments handling infrastructure complaints."
		},
		{
			property: "og:title",
			content: "Departments — InfraTrack"
		},
		{
			property: "og:description",
			content: "Manage the departments that resolve city issues."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
var IndexRoute = Route$13.update({
	id: "/",
	path: "/",
	getParentRoute: () => Route$14
});
var AboutRoute = Route$12.update({
	id: "/about",
	path: "/about",
	getParentRoute: () => Route$14
});
var DashboardRoute = Route$11.update({
	id: "/dashboard",
	path: "/dashboard",
	getParentRoute: () => Route$14
});
var LoginRoute = Route$10.update({
	id: "/login",
	path: "/login",
	getParentRoute: () => Route$14
});
var MapRoute = Route$9.update({
	id: "/map",
	path: "/map",
	getParentRoute: () => Route$14
});
var MyComplaintsRoute = Route$8.update({
	id: "/my-complaints",
	path: "/my-complaints",
	getParentRoute: () => Route$14
});
var NotificationsRoute = Route$7.update({
	id: "/notifications",
	path: "/notifications",
	getParentRoute: () => Route$14
});
var ProfileRoute = Route$6.update({
	id: "/profile",
	path: "/profile",
	getParentRoute: () => Route$14
});
var RegisterRoute = Route$5.update({
	id: "/register",
	path: "/register",
	getParentRoute: () => Route$14
});
var ReportRoute = Route$4.update({
	id: "/report",
	path: "/report",
	getParentRoute: () => Route$14
});
var AdminIndexRoute = Route$3.update({
	id: "/admin/",
	path: "/admin/",
	getParentRoute: () => Route$14
});
var rootRouteChildren = {
	IndexRoute,
	AboutRoute,
	DashboardRoute,
	LoginRoute,
	MapRoute,
	MyComplaintsRoute,
	NotificationsRoute,
	ProfileRoute,
	RegisterRoute,
	ReportRoute,
	AdminAnalyticsRoute: Route$2.update({
		id: "/admin/analytics",
		path: "/admin/analytics",
		getParentRoute: () => Route$14
	}),
	AdminComplaintsRoute: Route$1.update({
		id: "/admin/complaints",
		path: "/admin/complaints",
		getParentRoute: () => Route$14
	}),
	AdminDepartmentsRoute: Route.update({
		id: "/admin/departments",
		path: "/admin/departments",
		getParentRoute: () => Route$14
	}),
	ComplaintsIdRoute: Route$15.update({
		id: "/complaints/$id",
		path: "/complaints/$id",
		getParentRoute: () => Route$14
	}),
	AdminIndexRoute
};
var routeTree = Route$14._addFileChildren(rootRouteChildren)._addFileTypes();
var getRouter = () => {
	const queryClient = new QueryClient();
	return createRouter({
		routeTree,
		context: { queryClient },
		scrollRestoration: true,
		defaultPreloadStaleTime: 0
	});
};
//#endregion
export { getRouter };
