import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { _ as useNavigate, g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as require_jsx_runtime } from "../_libs/@radix-ui/react-label+[...].mjs";
import { t as supabase } from "./client-DdbXR2jE.mjs";
import { n as useAuth } from "./useAuth-DIts1sgr.mjs";
import { t as Button } from "./button-DRsC1qZi.mjs";
import { a as ShieldCheck } from "../_libs/lucide-react.mjs";
import { t as Input } from "./input-DicJzR9-.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as Label } from "./label-B4PTMSG2.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/login-IZxiR216.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function LoginPage() {
	const { user, isAdmin, loading } = useAuth();
	const navigate = useNavigate();
	const [email, setEmail] = (0, import_react.useState)("");
	const [password, setPassword] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		if (!loading && user) navigate({
			to: isAdmin ? "/admin" : "/dashboard",
			replace: true
		});
	}, [
		loading,
		user,
		isAdmin,
		navigate
	]);
	async function onSubmit(e) {
		e.preventDefault();
		setBusy(true);
		const { error } = await supabase.auth.signInWithPassword({
			email,
			password
		});
		setBusy(false);
		if (error) toast.error(error.message);
		else toast.success("Welcome back!");
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-muted/40 px-4 py-10",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "w-full max-w-sm rounded-xl border bg-card p-6 shadow-card",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/",
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "rounded-md bg-primary p-1.5 text-primary-foreground",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "h-4 w-4" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-display font-semibold",
						children: "InfraTrack"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-6 font-display text-2xl font-semibold",
					children: "Sign in"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm text-muted-foreground",
					children: "Track your civic complaints."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit,
					className: "mt-6 space-y-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "email",
								children: "Email"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "email",
								type: "email",
								required: true,
								value: email,
								onChange: (e) => setEmail(e.target.value),
								placeholder: "you@example.com"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "password",
								children: "Password"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "password",
								type: "password",
								required: true,
								value: password,
								onChange: (e) => setPassword(e.target.value)
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "submit",
							className: "w-full",
							disabled: busy,
							children: busy ? "Signing in…" : "Sign in"
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-5 text-center text-sm text-muted-foreground",
					children: [
						"New here?",
						" ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/register",
							className: "text-primary hover:underline",
							children: "Create an account"
						})
					]
				})
			]
		})
	});
}
//#endregion
export { LoginPage as component };
