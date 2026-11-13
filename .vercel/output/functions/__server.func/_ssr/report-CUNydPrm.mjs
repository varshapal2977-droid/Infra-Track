import { i as __toESM } from "../_runtime.mjs";
import { d as suggestPriority, n as DEPARTMENT_FOR_CATEGORY, r as PRIORITIES, t as CATEGORIES } from "./infratrack-BZipgbjk.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { _ as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as require_jsx_runtime } from "../_libs/@radix-ui/react-label+[...].mjs";
import { t as supabase } from "./client-DdbXR2jE.mjs";
import { n as useAuth } from "./useAuth-DIts1sgr.mjs";
import { t as RequireAuth } from "./RequireAuth-BtytK1xd.mjs";
import { t as Button } from "./button-DRsC1qZi.mjs";
import { p as Crosshair } from "../_libs/lucide-react.mjs";
import { t as AppShell } from "./AppShell-WtwtyNzz.mjs";
import { n as fetchDepartments } from "./complaints-l8toGHjo.mjs";
import { t as MapPanel } from "./MapPanel-GVA0RwDS.mjs";
import { t as useQuery } from "../_libs/tanstack__react-query.mjs";
import { t as Input } from "./input-DicJzR9-.mjs";
import { t as Textarea } from "./textarea-DBn9CRiI.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as Label } from "./label-B4PTMSG2.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/report-CUNydPrm.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ReportForm() {
	const { user } = useAuth();
	const navigate = useNavigate();
	const { data: departments = [] } = useQuery({
		queryKey: ["departments"],
		queryFn: fetchDepartments
	});
	const [title, setTitle] = (0, import_react.useState)("");
	const [description, setDescription] = (0, import_react.useState)("");
	const [category, setCategory] = (0, import_react.useState)("road_pothole");
	const [priority, setPriority] = (0, import_react.useState)("medium");
	const [touchedPriority, setTouchedPriority] = (0, import_react.useState)(false);
	const [address, setAddress] = (0, import_react.useState)("");
	const [area, setArea] = (0, import_react.useState)("");
	const [imageUrl, setImageUrl] = (0, import_react.useState)("");
	const [picked, setPicked] = (0, import_react.useState)(null);
	const [busy, setBusy] = (0, import_react.useState)(false);
	const suggested = (0, import_react.useMemo)(() => suggestPriority(category, `${title} ${description}`), [
		category,
		title,
		description
	]);
	(0, import_react.useEffect)(() => {
		if (!touchedPriority) setPriority(suggested);
	}, [suggested, touchedPriority]);
	const departmentName = DEPARTMENT_FOR_CATEGORY[category];
	const department = departments.find((d) => d.name === departmentName);
	function useMyLocation() {
		if (!navigator.geolocation) {
			toast.error("Location is not available on this device.");
			return;
		}
		navigator.geolocation.getCurrentPosition((pos) => setPicked({
			lat: pos.coords.latitude,
			lng: pos.coords.longitude
		}), () => toast.error("Could not read your location. Tap the map instead."));
	}
	async function onSubmit(e) {
		e.preventDefault();
		if (!picked) {
			toast.error("Mark the location on the map first.");
			return;
		}
		setBusy(true);
		const { data, error } = await supabase.from("complaints").insert({
			user_id: user.id,
			title,
			description,
			category,
			priority,
			address,
			area: area || null,
			image_url: imageUrl || null,
			latitude: picked.lat,
			longitude: picked.lng,
			department_id: department?.id ?? null
		}).select("id, complaint_id").single();
		if (error || !data) {
			setBusy(false);
			toast.error(error?.message ?? "Could not submit the complaint.");
			return;
		}
		await supabase.from("status_history").insert({
			complaint_id: data.id,
			old_status: null,
			new_status: "pending",
			changed_by: user.id,
			remarks: "Complaint submitted"
		});
		await supabase.from("notifications").insert({
			user_id: user.id,
			complaint_id: data.id,
			message: `${data.complaint_id} received and sent to ${departmentName}.`
		});
		setBusy(false);
		toast.success(`Complaint ${data.complaint_id} submitted.`);
		navigate({
			to: "/complaints/$id",
			params: { id: data.id }
		});
	}
	const selectClass = "h-10 w-full rounded-md border bg-background px-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-ring";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
		onSubmit,
		className: "grid gap-6 lg:grid-cols-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-4 rounded-xl border bg-card p-5 shadow-card",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						htmlFor: "title",
						children: "Title"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						id: "title",
						required: true,
						value: title,
						onChange: (e) => setTitle(e.target.value),
						placeholder: "Large pothole near bus stop"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						htmlFor: "desc",
						children: "Description"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
						id: "desc",
						required: true,
						rows: 4,
						value: description,
						onChange: (e) => setDescription(e.target.value),
						placeholder: "What is wrong, how big is it, is anyone at risk?"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-4 sm:grid-cols-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "cat",
							children: "Category"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
							id: "cat",
							className: selectClass,
							value: category,
							onChange: (e) => setCategory(e.target.value),
							children: CATEGORIES.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: c.value,
								children: c.label
							}, c.value))
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1.5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "prio",
								children: "Priority"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
								id: "prio",
								className: selectClass,
								value: priority,
								onChange: (e) => {
									setTouchedPriority(true);
									setPriority(e.target.value);
								},
								children: PRIORITIES.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: p.value,
									children: p.label
								}, p.value))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-xs text-muted-foreground",
								children: ["Suggested: ", suggested]
							})
						]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-lg bg-muted/50 p-3 text-sm",
					children: ["Will be sent to ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: departmentName })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						htmlFor: "addr",
						children: "Address / landmark"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						id: "addr",
						required: true,
						value: address,
						onChange: (e) => setAddress(e.target.value),
						placeholder: "MG Road, near Metro Pillar 42"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-4 sm:grid-cols-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "area",
							children: "Area / ward (optional)"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "area",
							value: area,
							onChange: (e) => setArea(e.target.value)
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "img",
							children: "Photo link (optional)"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "img",
							value: imageUrl,
							onChange: (e) => setImageUrl(e.target.value),
							placeholder: "https://…"
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "submit",
					className: "w-full",
					disabled: busy,
					children: busy ? "Submitting…" : "Submit complaint"
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-sm text-muted-foreground",
					children: ["Tap the map to mark the exact spot.", picked ? ` (${picked.lat.toFixed(4)}, ${picked.lng.toFixed(4)})` : ""]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					type: "button",
					size: "sm",
					variant: "outline",
					className: "ml-auto",
					onClick: useMyLocation,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Crosshair, { className: "mr-1.5 h-4 w-4" }), " Use my location"]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPanel, {
				height: "520px",
				center: picked ? [picked.lat, picked.lng] : [20.5937, 78.9629],
				zoom: picked ? 14 : 5,
				picked,
				onPick: (lat, lng) => setPicked({
					lat,
					lng
				})
			})]
		})]
	});
}
var SplitComponent = () => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RequireAuth, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, {
	title: "Report an Issue",
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReportForm, {})
}) });
//#endregion
export { SplitComponent as component };
