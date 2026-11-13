import { c as formatDateTime } from "./infratrack-BZipgbjk.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as require_jsx_runtime } from "../_libs/@radix-ui/react-label+[...].mjs";
import { t as supabase } from "./client-DdbXR2jE.mjs";
import { n as useAuth } from "./useAuth-DIts1sgr.mjs";
import { t as RequireAuth } from "./RequireAuth-BtytK1xd.mjs";
import { t as Button } from "./button-DRsC1qZi.mjs";
import { x as Bell } from "../_libs/lucide-react.mjs";
import { t as AppShell } from "./AppShell-WtwtyNzz.mjs";
import { r as useQueryClient, t as useQuery } from "../_libs/tanstack__react-query.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/notifications-cIWOrPoM.js
var import_jsx_runtime = require_jsx_runtime();
function Notifications() {
	const { user } = useAuth();
	const qc = useQueryClient();
	const { data = [], isLoading } = useQuery({
		queryKey: ["notifications", user?.id],
		queryFn: async () => {
			const { data, error } = await supabase.from("notifications").select("*").order("created_at", { ascending: false });
			if (error) throw error;
			return data ?? [];
		},
		enabled: !!user
	});
	async function markAllRead() {
		await supabase.from("notifications").update({ is_read: true }).eq("is_read", false);
		qc.invalidateQueries({ queryKey: ["notifications"] });
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-sm text-muted-foreground",
				children: [data.filter((n) => !n.is_read).length, " unread"]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				size: "sm",
				variant: "outline",
				className: "ml-auto",
				onClick: markAllRead,
				children: "Mark all as read"
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "rounded-xl border bg-card shadow-card",
			children: isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "p-5 text-sm text-muted-foreground",
				children: "Loading…"
			}) : data.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "p-5 text-sm text-muted-foreground",
				children: "No notifications yet."
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "divide-y",
				children: data.map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "flex gap-3 px-5 py-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bell, { className: `mt-0.5 h-4 w-4 ${n.is_read ? "text-muted-foreground" : "text-primary"}` }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0 flex-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: n.is_read ? "text-muted-foreground" : "font-medium",
								children: n.message
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted-foreground",
								children: formatDateTime(n.created_at)
							})]
						}),
						n.complaint_id ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/complaints/$id",
							params: { id: n.complaint_id },
							className: "text-sm text-primary hover:underline",
							children: "View"
						}) : null
					]
				}, n.id))
			})
		})]
	});
}
var SplitComponent = () => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RequireAuth, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, {
	title: "Notifications",
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Notifications, {})
}) });
//#endregion
export { SplitComponent as component };
