import { i as __toESM } from "../_runtime.mjs";
import { s as formatDate } from "./infratrack-BZipgbjk.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { i as require_jsx_runtime } from "../_libs/@radix-ui/react-label+[...].mjs";
import { t as supabase } from "./client-DdbXR2jE.mjs";
import { n as useAuth } from "./useAuth-DIts1sgr.mjs";
import { t as RequireAuth } from "./RequireAuth-BtytK1xd.mjs";
import { t as Button } from "./button-DRsC1qZi.mjs";
import { a as ShieldCheck } from "../_libs/lucide-react.mjs";
import { t as AppShell } from "./AppShell-WtwtyNzz.mjs";
import { t as Input } from "./input-DicJzR9-.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as Label } from "./label-B4PTMSG2.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/profile-CdRDUy2E.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ProfilePage() {
	const { profile, user, isAdmin, refresh } = useAuth();
	const [fullName, setFullName] = (0, import_react.useState)("");
	const [phone, setPhone] = (0, import_react.useState)("");
	const [code, setCode] = (0, import_react.useState)("");
	const [saving, setSaving] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		setFullName(profile?.full_name ?? "");
		setPhone(profile?.phone ?? "");
	}, [profile]);
	async function save(e) {
		e.preventDefault();
		if (!user) return;
		setSaving(true);
		const { error } = await supabase.from("profiles").update({
			full_name: fullName,
			phone: phone || null
		}).eq("id", user.id);
		setSaving(false);
		if (error) toast.error(error.message);
		else {
			toast.success("Profile updated");
			await refresh();
		}
	}
	async function claimAdmin(e) {
		e.preventDefault();
		const { data, error } = await supabase.rpc("claim_admin_role", { _code: code.trim() });
		if (error) {
			toast.error(error.message);
			return;
		}
		if (!data) {
			toast.error("That access code is not valid.");
			return;
		}
		setCode("");
		await refresh();
		toast.success("Authority access granted. Your menu now shows the admin pages.");
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid max-w-4xl gap-6 lg:grid-cols-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			onSubmit: save,
			className: "space-y-4 rounded-xl border bg-card p-5 shadow-card",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-lg font-semibold",
					children: "Account details"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						htmlFor: "name",
						children: "Full name"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						id: "name",
						value: fullName,
						onChange: (e) => setFullName(e.target.value)
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						htmlFor: "email",
						children: "Email"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						id: "email",
						value: profile?.email ?? user?.email ?? "",
						disabled: true
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						htmlFor: "phone",
						children: "Phone"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						id: "phone",
						value: phone,
						placeholder: "+91 98xxxxxxxx",
						onChange: (e) => setPhone(e.target.value)
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-xs text-muted-foreground",
					children: ["Member since ", formatDate(profile?.created_at)]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "submit",
					disabled: saving,
					children: saving ? "Saving…" : "Save changes"
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-4 rounded-xl border bg-card p-5 shadow-card",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "h-5 w-5 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-lg font-semibold",
						children: "Access level"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-sm text-muted-foreground",
					children: [
						"You are signed in as",
						" ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-medium text-foreground",
							children: isAdmin ? "Authority" : "Citizen"
						}),
						"."
					]
				}),
				isAdmin ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground",
					children: "You can manage complaints, departments and view city-wide analytics."
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit: claimAdmin,
					className: "space-y-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "code",
							children: "Authority access code"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "code",
							value: code,
							onChange: (e) => setCode(e.target.value),
							placeholder: "Enter the code given by your department"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "submit",
							variant: "secondary",
							children: "Unlock authority access"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-xs text-muted-foreground",
							children: ["Demo code: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-mono",
								children: "INFRA-ADMIN-2026"
							})]
						})
					]
				})
			]
		})]
	});
}
var SplitComponent = () => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RequireAuth, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, {
	title: "Profile",
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProfilePage, {})
}) });
//#endregion
export { SplitComponent as component };
