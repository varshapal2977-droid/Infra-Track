import { i as __toESM } from "../_runtime.mjs";
import { i as STATUSES, o as categoryLabel, r as PRIORITIES, s as formatDate, t as CATEGORIES } from "./infratrack-BZipgbjk.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as require_jsx_runtime } from "../_libs/@radix-ui/react-label+[...].mjs";
import { t as supabase } from "./client-DdbXR2jE.mjs";
import { n as useAuth } from "./useAuth-DIts1sgr.mjs";
import { t as RequireAuth } from "./RequireAuth-BtytK1xd.mjs";
import { t as Button } from "./button-DRsC1qZi.mjs";
import { t as AppShell } from "./AppShell-WtwtyNzz.mjs";
import { n as fetchDepartments, r as updateStatus, t as fetchComplaints } from "./complaints-l8toGHjo.mjs";
import { n as StatusBadge, t as PriorityBadge } from "./Badges-DnWDqIP6.mjs";
import { r as useQueryClient, t as useQuery } from "../_libs/tanstack__react-query.mjs";
import { t as Input } from "./input-DicJzR9-.mjs";
import { t as Textarea } from "./textarea-DBn9CRiI.mjs";
import { n as toast } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/complaints-BHUEiip0.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var selectClass = "h-10 rounded-md border bg-background px-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-ring";
function ManageComplaints() {
	const qc = useQueryClient();
	const { user } = useAuth();
	const { data = [], isLoading } = useQuery({
		queryKey: ["complaints", "all"],
		queryFn: () => fetchComplaints()
	});
	const { data: departments = [] } = useQuery({
		queryKey: ["departments"],
		queryFn: fetchDepartments
	});
	const [q, setQ] = (0, import_react.useState)("");
	const [status, setStatus] = (0, import_react.useState)("all");
	const [category, setCategory] = (0, import_react.useState)("all");
	const [priority, setPriority] = (0, import_react.useState)("all");
	const [selected, setSelected] = (0, import_react.useState)(null);
	const rows = (0, import_react.useMemo)(() => data.filter((c) => (status === "all" || c.status === status) && (category === "all" || c.category === category) && (priority === "all" || c.priority === priority) && (q === "" || `${c.title} ${c.description} ${c.address} ${c.area ?? ""} ${c.complaint_id}`.toLowerCase().includes(q.toLowerCase()))), [
		data,
		q,
		status,
		category,
		priority
	]);
	function refresh() {
		qc.invalidateQueries({ queryKey: ["complaints"] });
	}
	async function assign(c, field, value) {
		const patch = field === "department_id" ? { department_id: value } : { priority: value };
		const { error } = await supabase.from("complaints").update(patch).eq("id", c.id);
		if (error) {
			toast.error(error.message);
			return;
		}
		refresh();
		toast.success("Complaint updated");
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap gap-2 rounded-xl border bg-card p-3 shadow-card",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						className: "max-w-xs",
						placeholder: "Search issue, ID, area",
						value: q,
						onChange: (e) => setQ(e.target.value)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
						className: selectClass,
						value: status,
						onChange: (e) => setStatus(e.target.value),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "all",
							children: "All statuses"
						}), STATUSES.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: s.value,
							children: s.label
						}, s.value))]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
						className: selectClass,
						value: category,
						onChange: (e) => setCategory(e.target.value),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "all",
							children: "All categories"
						}), CATEGORIES.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: c.value,
							children: c.label
						}, c.value))]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
						className: selectClass,
						value: priority,
						onChange: (e) => setPriority(e.target.value),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "all",
							children: "All priorities"
						}), PRIORITIES.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: p.value,
							children: p.label
						}, p.value))]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "ml-auto self-center text-sm text-muted-foreground",
						children: [
							rows.length,
							" complaint",
							rows.length === 1 ? "" : "s"
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "overflow-x-auto rounded-xl border bg-card shadow-card",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
					className: "w-full text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
						className: "bg-muted/50 text-left text-xs tracking-wide text-muted-foreground uppercase",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-3",
								children: "ID"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-3",
								children: "Issue"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-3",
								children: "Category"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-3",
								children: "Department"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-3",
								children: "Priority"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-3",
								children: "Status"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-3",
								children: "Reported"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { className: "px-4 py-3" })
						] })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
						className: "divide-y",
						children: isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							colSpan: 8,
							className: "px-4 py-6 text-muted-foreground",
							children: "Loading…"
						}) }) : rows.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							colSpan: 8,
							className: "px-4 py-6 text-muted-foreground",
							children: "No complaints match these filters."
						}) }) : rows.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
							className: "hover:bg-muted/40",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-3 font-mono text-xs",
									children: c.complaint_id
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
									className: "px-4 py-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
										to: "/complaints/$id",
										params: { id: c.id },
										className: "font-medium hover:text-primary",
										children: c.title
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs text-muted-foreground",
										children: c.area ?? c.address
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-3",
									children: categoryLabel(c.category)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-3",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
										className: selectClass,
										value: c.department_id ?? "",
										onChange: (e) => assign(c, "department_id", e.target.value),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "",
											children: "Unassigned"
										}), departments.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: d.id,
											children: d.name
										}, d.id))]
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-3",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PriorityBadge, { priority: c.priority })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-3",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { status: c.status })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-3 whitespace-nowrap",
									children: formatDate(c.created_at)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-3",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										size: "sm",
										variant: "outline",
										onClick: () => setSelected(c),
										children: "Update"
									})
								})
							]
						}, c.id))
					})]
				})
			}),
			selected ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UpdateDialog, {
				complaint: selected,
				actorId: user?.id ?? "",
				onClose: () => setSelected(null),
				onDone: () => {
					setSelected(null);
					refresh();
				}
			}) : null
		]
	});
}
function UpdateDialog({ complaint, actorId, onClose, onDone }) {
	const [status, setStatus] = (0, import_react.useState)(complaint.status);
	const [remarks, setRemarks] = (0, import_react.useState)("");
	const [saving, setSaving] = (0, import_react.useState)(false);
	async function submit(e) {
		e.preventDefault();
		setSaving(true);
		try {
			await updateStatus(complaint, status, remarks, actorId);
			toast.success(`${complaint.complaint_id} updated`);
			onDone();
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Could not update complaint");
		} finally {
			setSaving(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 p-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			onSubmit: submit,
			className: "w-full max-w-md space-y-4 rounded-xl border bg-card p-5 shadow-lg",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "font-display text-lg font-semibold",
					children: complaint.title
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-muted-foreground",
					children: complaint.complaint_id
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "text-sm font-medium",
						children: "New status"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
						className: "h-10 rounded-md border bg-background px-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-ring w-full",
						value: status,
						onChange: (e) => setStatus(e.target.value),
						children: STATUSES.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: s.value,
							children: s.label
						}, s.value))
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "text-sm font-medium",
						children: "Remarks for the citizen"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
						value: remarks,
						onChange: (e) => setRemarks(e.target.value),
						placeholder: "Crew scheduled for tomorrow morning."
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex justify-end gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "button",
						variant: "ghost",
						onClick: onClose,
						children: "Cancel"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "submit",
						disabled: saving,
						children: saving ? "Saving…" : "Save update"
					})]
				})
			]
		})
	});
}
var SplitComponent = () => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RequireAuth, {
	admin: true,
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, {
		title: "Manage Complaints",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ManageComplaints, {})
	})
});
//#endregion
export { SplitComponent as component };
