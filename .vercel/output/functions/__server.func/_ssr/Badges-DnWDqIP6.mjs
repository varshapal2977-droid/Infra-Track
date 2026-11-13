import { l as priorityLabel, u as statusLabel } from "./infratrack-BZipgbjk.mjs";
import { i as require_jsx_runtime } from "../_libs/@radix-ui/react-label+[...].mjs";
import { n as cn } from "./button-DRsC1qZi.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/Badges-DnWDqIP6.js
var import_jsx_runtime = require_jsx_runtime();
var statusStyles = {
	pending: "bg-muted text-muted-foreground border-border",
	assigned: "bg-info/10 text-info border-info/30",
	in_progress: "bg-warning/15 text-accent-foreground border-warning/40",
	resolved: "bg-success/12 text-success border-success/30",
	rejected: "bg-destructive/10 text-destructive border-destructive/30"
};
var priorityStyles = {
	low: "bg-muted text-muted-foreground border-border",
	medium: "bg-info/10 text-info border-info/30",
	high: "bg-destructive/10 text-destructive border-destructive/30"
};
function Pill({ className, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn("inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium whitespace-nowrap", className),
		children
	});
}
var StatusBadge = ({ status }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pill, {
	className: statusStyles[status] ?? statusStyles["pending"],
	children: statusLabel(status)
});
var PriorityBadge = ({ priority }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pill, {
	className: priorityStyles[priority] ?? priorityStyles["low"],
	children: priorityLabel(priority)
});
//#endregion
export { StatusBadge as n, PriorityBadge as t };
