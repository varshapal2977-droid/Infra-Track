import { a as STATUS_FLOW, c as formatDateTime, o as categoryLabel, u as statusLabel } from "./infratrack-BZipgbjk.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as require_jsx_runtime } from "../_libs/@radix-ui/react-label+[...].mjs";
import { t as supabase } from "./client-DdbXR2jE.mjs";
import { t as RequireAuth } from "./RequireAuth-BtytK1xd.mjs";
import { n as cn } from "./button-DRsC1qZi.mjs";
import { v as Check } from "../_libs/lucide-react.mjs";
import { t as AppShell } from "./AppShell-WtwtyNzz.mjs";
import { n as StatusBadge, t as PriorityBadge } from "./Badges-DnWDqIP6.mjs";
import { t as MapPanel } from "./MapPanel-GVA0RwDS.mjs";
import { t as useQuery } from "../_libs/tanstack__react-query.mjs";
import { t as Route } from "./complaints._id-BArt-d4y.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/complaints._id-C_XQAOk9.js
var import_jsx_runtime = require_jsx_runtime();
function StatusTimeline({ status, history }) {
	if (status === "rejected") {
		const rejected = history.find((h) => h.new_status === "rejected");
		return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "rounded-lg border border-destructive/30 bg-destructive/5 p-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-medium text-destructive",
					children: "Complaint rejected"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm text-muted-foreground",
					children: rejected?.remarks || "This complaint was reviewed and closed by the authority."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-xs text-muted-foreground",
					children: formatDateTime(rejected?.changed_at)
				})
			]
		});
	}
	const currentIndex = STATUS_FLOW.indexOf(status);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
		className: "space-y-0",
		children: STATUS_FLOW.map((step, i) => {
			const reached = i <= currentIndex;
			const entry = [...history].reverse().find((h) => h.new_status === step);
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
				className: "flex gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col items-center",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: cn("flex h-7 w-7 items-center justify-center rounded-full border text-xs font-semibold", reached ? "border-primary bg-primary text-primary-foreground" : "border-border bg-muted text-muted-foreground"),
						children: reached ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-3.5 w-3.5" }) : i + 1
					}), i < STATUS_FLOW.length - 1 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: cn("my-1 w-px flex-1", i < currentIndex ? "bg-primary" : "bg-border") }) : null]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "pb-6",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: cn("font-medium", !reached && "text-muted-foreground"),
							children: step === "pending" ? "Submitted" : statusLabel(step)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground",
							children: entry ? formatDateTime(entry.changed_at) : "Awaiting update"
						}),
						entry?.remarks ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-sm text-muted-foreground",
							children: entry.remarks
						}) : null
					]
				})]
			}, step);
		})
	});
}
function Details() {
	const { id } = Route.useParams();
	const { data, isLoading } = useQuery({
		queryKey: ["complaint", id],
		queryFn: async () => {
			const [{ data: complaint, error }, { data: history }, { data: departments }] = await Promise.all([
				supabase.from("complaints").select("*").eq("id", id).maybeSingle(),
				supabase.from("status_history").select("*").eq("complaint_id", id).order("changed_at", { ascending: true }),
				supabase.from("departments").select("id, name")
			]);
			if (error) throw error;
			return {
				complaint,
				history: history ?? [],
				departments: departments ?? []
			};
		}
	});
	if (isLoading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-sm text-muted-foreground",
		children: "Loading…"
	});
	if (!data?.complaint) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-sm text-muted-foreground",
		children: "Complaint not found."
	});
	const c = data.complaint;
	const department = data.departments.find((d) => d.id === c.department_id)?.name ?? "Unassigned";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-6 lg:grid-cols-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-6 lg:col-span-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-xl border bg-card p-5 shadow-card",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-mono text-xs text-muted-foreground",
								children: c.complaint_id
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { status: c.status }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PriorityBadge, { priority: c.priority })
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mt-3 font-display text-2xl font-semibold",
						children: c.title
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm text-muted-foreground",
						children: c.description
					}),
					c.image_url ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: c.image_url,
						alt: `Photo of the reported issue: ${c.title}`,
						loading: "lazy",
						className: "mt-4 max-h-72 w-full rounded-lg object-cover"
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
						className: "mt-5 grid gap-4 text-sm sm:grid-cols-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Category",
								value: categoryLabel(c.category)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Department",
								value: department
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Location",
								value: c.address
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Area",
								value: c.area || "—"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Reported",
								value: formatDateTime(c.created_at)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Last update",
								value: formatDateTime(c.updated_at)
							}),
							c.resolved_at ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Resolved",
								value: formatDateTime(c.resolved_at)
							}) : null
						]
					}),
					c.remarks ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-5 rounded-lg bg-muted/50 p-3 text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-medium",
							children: "Authority remarks"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-muted-foreground",
							children: c.remarks
						})]
					}) : null
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPanel, {
				complaints: [c],
				center: [c.latitude, c.longitude],
				zoom: 15,
				height: "320px"
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-4 rounded-xl border bg-card p-5 shadow-card",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "font-medium",
					children: "Progress"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusTimeline, {
					status: c.status,
					history: data.history
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/my-complaints",
					className: "text-sm text-primary hover:underline",
					children: "← Back to my complaints"
				})
			]
		})]
	});
}
function Field({ label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
		className: "text-xs tracking-wide text-muted-foreground uppercase",
		children: label
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
		className: "mt-0.5",
		children: value
	})] });
}
var SplitComponent = () => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RequireAuth, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, {
	title: "Complaint Details",
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Details, {})
}) });
//#endregion
export { SplitComponent as component };
