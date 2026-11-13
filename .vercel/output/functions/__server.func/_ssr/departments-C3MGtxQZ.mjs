import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { i as require_jsx_runtime } from "../_libs/@radix-ui/react-label+[...].mjs";
import { t as supabase } from "./client-DdbXR2jE.mjs";
import { t as RequireAuth } from "./RequireAuth-BtytK1xd.mjs";
import { t as Button } from "./button-DRsC1qZi.mjs";
import { t as AppShell } from "./AppShell-WtwtyNzz.mjs";
import { n as fetchDepartments, t as fetchComplaints } from "./complaints-l8toGHjo.mjs";
import { r as useQueryClient, t as useQuery } from "../_libs/tanstack__react-query.mjs";
import { t as Input } from "./input-DicJzR9-.mjs";
import { n as toast } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/departments-C3MGtxQZ.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Departments() {
	const qc = useQueryClient();
	const { data: departments = [] } = useQuery({
		queryKey: ["departments"],
		queryFn: fetchDepartments
	});
	const { data: complaints = [] } = useQuery({
		queryKey: ["complaints", "all"],
		queryFn: () => fetchComplaints()
	});
	const [name, setName] = (0, import_react.useState)("");
	const [description, setDescription] = (0, import_react.useState)("");
	async function addDepartment(e) {
		e.preventDefault();
		if (!name.trim()) return;
		const { error } = await supabase.from("departments").insert({
			name: name.trim(),
			description: description.trim() || null
		});
		if (error) {
			toast.error(error.message);
			return;
		}
		setName("");
		setDescription("");
		qc.invalidateQueries({ queryKey: ["departments"] });
		toast.success("Department added");
	}
	const stats = (id) => {
		const rows = complaints.filter((c) => c.department_id === id);
		return {
			total: rows.length,
			open: rows.filter((c) => c.status !== "resolved" && c.status !== "rejected").length,
			resolved: rows.filter((c) => c.status === "resolved").length
		};
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			onSubmit: addDepartment,
			className: "flex flex-wrap items-end gap-3 rounded-xl border bg-card p-4 shadow-card",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex-1 min-w-48",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "text-sm font-medium",
						children: "Department name"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: name,
						onChange: (e) => setName(e.target.value),
						placeholder: "Parks Department"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex-1 min-w-48",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "text-sm font-medium",
						children: "Description"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: description,
						onChange: (e) => setDescription(e.target.value),
						placeholder: "Maintains public parks and green spaces"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "submit",
					children: "Add department"
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid gap-4 md:grid-cols-2 xl:grid-cols-3",
			children: departments.map((d) => {
				const s = stats(d.id);
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl border bg-card p-5 shadow-card",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "font-display font-semibold",
							children: d.name
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-sm text-muted-foreground",
							children: d.description ?? "—"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
							className: "mt-4 grid grid-cols-3 gap-2 text-center text-sm",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-md bg-muted/50 p-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
										className: "text-xs text-muted-foreground",
										children: "Total"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
										className: "font-semibold",
										children: s.total
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-md bg-muted/50 p-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
										className: "text-xs text-muted-foreground",
										children: "Open"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
										className: "font-semibold",
										children: s.open
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-md bg-muted/50 p-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
										className: "text-xs text-muted-foreground",
										children: "Resolved"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
										className: "font-semibold",
										children: s.resolved
									})]
								})
							]
						})
					]
				}, d.id);
			})
		})]
	});
}
var SplitComponent = () => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RequireAuth, {
	admin: true,
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, {
		title: "Departments",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Departments, {})
	})
});
//#endregion
export { SplitComponent as component };
