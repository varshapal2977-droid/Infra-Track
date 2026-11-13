import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { _ as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as require_jsx_runtime } from "../_libs/@radix-ui/react-label+[...].mjs";
import { n as useAuth } from "./useAuth-DIts1sgr.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/RequireAuth-BtytK1xd.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
/** Client-side route guard. Database access is additionally protected by row-level security. */
function RequireAuth({ children, admin = false }) {
	const { user, isAdmin, loading } = useAuth();
	const navigate = useNavigate();
	(0, import_react.useEffect)(() => {
		if (loading) return;
		if (!user) navigate({
			to: "/login",
			replace: true
		});
		else if (admin && !isAdmin) navigate({
			to: "/dashboard",
			replace: true
		});
	}, [
		loading,
		user,
		isAdmin,
		admin,
		navigate
	]);
	if (loading || !user || admin && !isAdmin) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center text-sm text-muted-foreground",
		children: "Checking access…"
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children });
}
//#endregion
export { RequireAuth as t };
