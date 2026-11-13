import { i as require_jsx_runtime } from "../_libs/@radix-ui/react-label+[...].mjs";
import { n as cn } from "./button-DRsC1qZi.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/StatCard-LVLYL12a.js
var import_jsx_runtime = require_jsx_runtime();
function StatCard({ label, value, icon: Icon, hint, tone = "default" }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "rounded-xl border bg-card p-5 shadow-card",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-start justify-between gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs font-medium tracking-wide text-muted-foreground uppercase",
					children: label
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 font-display text-3xl font-semibold",
					children: value
				}),
				hint ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-xs text-muted-foreground",
					children: hint
				}) : null
			] }), Icon ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: cn("rounded-lg p-2", {
					default: "text-primary bg-primary/10",
					accent: "text-accent-foreground bg-accent/25",
					success: "text-success bg-success/12",
					destructive: "text-destructive bg-destructive/10",
					info: "text-info bg-info/10"
				}[tone]),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-5 w-5" })
			}) : null]
		})
	});
}
//#endregion
export { StatCard as t };
