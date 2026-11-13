import { i as __toESM } from "../_runtime.mjs";
import { l as priorityLabel, o as categoryLabel, s as formatDate, u as statusLabel } from "./infratrack-BZipgbjk.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as require_jsx_runtime } from "../_libs/@radix-ui/react-label+[...].mjs";
import { t as require_leaflet_src } from "../_libs/leaflet.mjs";
import { a as CircleMarker, i as MapContainer, n as Popup, o as useMapEvents, r as Marker, t as TileLayer } from "../_libs/react-leaflet.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/ComplaintMap-C1--YjEw.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var import_leaflet_src = /* @__PURE__ */ __toESM(require_leaflet_src());
var priorityColor = {
	high: "#c2410c",
	medium: "#1d4ed8",
	low: "#0f766e"
};
function pinIcon(priority) {
	const color = priorityColor[priority] ?? priorityColor["low"];
	return import_leaflet_src.default.divIcon({
		className: "",
		html: `<span style="display:block;width:16px;height:16px;border-radius:9999px;background:${color};border:2px solid white;box-shadow:0 1px 4px rgba(0,0,0,.4)"></span>`,
		iconSize: [16, 16],
		iconAnchor: [8, 8]
	});
}
function ClickPicker({ onPick }) {
	useMapEvents({ click(e) {
		onPick(e.latlng.lat, e.latlng.lng);
	} });
	return null;
}
function ComplaintMap({ complaints = [], center = [20.5937, 78.9629], zoom = 5, height = "70vh", onPick, picked, density = false }) {
	const densityPoints = (0, import_react.useMemo)(() => {
		return complaints.map((c) => {
			const near = complaints.filter((o) => Math.abs(o.latitude - c.latitude) < .3 && Math.abs(o.longitude - c.longitude) < .3).length;
			return {
				...c,
				near
			};
		});
	}, [complaints]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "overflow-hidden rounded-xl border shadow-card",
		style: { height },
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(MapContainer, {
			center,
			zoom,
			style: {
				height: "100%",
				width: "100%"
			},
			scrollWheelZoom: true,
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TileLayer, {
					attribution: "© <a href=\"https://www.openstreetmap.org/copyright\">OpenStreetMap</a>",
					url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
				}),
				onPick ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ClickPicker, { onPick }) : null,
				picked ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Marker, {
					position: [picked.lat, picked.lng],
					icon: pinIcon("high")
				}) : null,
				density ? densityPoints.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleMarker, {
					center: [c.latitude, c.longitude],
					radius: 8 + c.near * 4,
					pathOptions: {
						color: "transparent",
						fillColor: c.near > 2 ? "#b91c1c" : c.near > 1 ? "#ea580c" : "#f59e0b",
						fillOpacity: .35
					}
				}, c.id)) : null,
				complaints.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Marker, {
					position: [c.latitude, c.longitude],
					icon: pinIcon(c.priority),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Popup, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1 text-sm",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-semibold",
								children: c.complaint_id
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-medium",
								children: c.title
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-muted-foreground",
								children: c.description?.slice(0, 120)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Category:" }),
								" ",
								categoryLabel(c.category)
							] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Priority:" }),
								" ",
								priorityLabel(c.priority),
								" \xA0",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Status:" }),
								" ",
								statusLabel(c.status)
							] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Location:" }),
								" ",
								c.address
							] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Submitted:" }),
								" ",
								formatDate(c.created_at)
							] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/complaints/$id",
								params: { id: c.id },
								className: "text-primary underline",
								children: "View details"
							})
						]
					}) })
				}, c.id))
			]
		})
	});
}
//#endregion
export { ComplaintMap as default };
