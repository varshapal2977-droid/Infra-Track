import { m as createFileRoute, p as lazyRouteComponent } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/complaints._id-BArt-d4y.js
var $$splitComponentImporter = () => import("./complaints._id-C_XQAOk9.mjs");
var Route = createFileRoute("/complaints/$id")({
	head: () => ({ meta: [
		{ title: "Complaint details — InfraTrack" },
		{
			name: "description",
			content: "Full history, location and status of a reported civic issue."
		},
		{
			property: "og:title",
			content: "Complaint details — InfraTrack"
		},
		{
			property: "og:description",
			content: "See how a reported civic issue is progressing."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
