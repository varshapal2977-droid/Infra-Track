import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { i as require_jsx_runtime } from "../_libs/@radix-ui/react-label+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/MapPanel-GVA0RwDS.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var ComplaintMap = (0, import_react.lazy)(() => import("./ComplaintMap-C1--YjEw.mjs"));
function MapPanel(props) {
	const [mounted, setMounted] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => setMounted(true), []);
	const placeholder = /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex items-center justify-center rounded-xl border bg-muted/40 text-sm text-muted-foreground",
		style: { height: props.height ?? "70vh" },
		children: "Loading map…"
	});
	if (!mounted) return placeholder;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_react.Suspense, {
		fallback: placeholder,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ComplaintMap, { ...props })
	});
}
//#endregion
export { MapPanel as t };
