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
//#region node_modules/.nitro/vite/services/ssr/assets/register-D3vT5CFU.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function RegisterPage() {
	const { user, loading } = useAuth();
	const navigate = useNavigate();
	const [form, setForm] = (0, import_react.useState)({
		full_name: "",
		email: "",
		phone: "",
		password: ""
	});
	const [busy, setBusy] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		if (!loading && user) navigate({
			to: "/dashboard",
			replace: true
		});
	}, [
		loading,
		user,
		navigate
	]);
	const set = (k) => (e) => setForm((f) => ({
		...f,
		[k]: e.target.value
	}));
	async function onSubmit(e) {
		e.preventDefault();
		setBusy(true);
		const { error } = await supabase.auth.signUp({
			email: form.email,
			password: form.password,
			options: {
				emailRedirectTo: window.location.origin,
				data: {
					full_name: form.full_name,
					phone: form.phone
				}
			}
		});
		setBusy(false);
		if (error) toast.error(error.message);
		else toast.success("Account created — you're signed in.");
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
					children: "Create your account"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit,
					className: "mt-6 space-y-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "name",
								children: "Full name"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "name",
								required: true,
								value: form.full_name,
								onChange: set("full_name")
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "email",
								children: "Email"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "email",
								type: "email",
								required: true,
								value: form.email,
								onChange: set("email")
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "phone",
								children: "Phone (optional)"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "phone",
								value: form.phone,
								onChange: set("phone")
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
								minLength: 6,
								value: form.password,
								onChange: set("password")
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "submit",
							className: "w-full",
							disabled: busy,
							children: busy ? "Creating…" : "Create account"
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-5 text-center text-sm text-muted-foreground",
					children: [
						"Already registered?",
						" ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/login",
							className: "text-primary hover:underline",
							children: "Sign in"
						})
					]
				})
			]
		})
	});
}
//#endregion
export { RegisterPage as component };
