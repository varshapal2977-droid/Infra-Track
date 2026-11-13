import { u as statusLabel } from "./infratrack-BZipgbjk.mjs";
import { t as supabase } from "./client-DdbXR2jE.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/complaints-l8toGHjo.js
async function fetchComplaints(filters) {
	let q = supabase.from("complaints").select("*").order("created_at", { ascending: false });
	if (filters?.userId) q = q.eq("user_id", filters.userId);
	const { data, error } = await q;
	if (error) throw error;
	return data ?? [];
}
async function fetchDepartments() {
	const { data, error } = await supabase.from("departments").select("*").order("name");
	if (error) throw error;
	return data ?? [];
}
async function notify(userId, complaintId, message) {
	await supabase.from("notifications").insert({
		user_id: userId,
		complaint_id: complaintId,
		message
	});
}
/** Update a complaint's status, log history and notify the reporter. */
async function updateStatus(complaint, newStatus, remarks, actorId) {
	const { error } = await supabase.from("complaints").update({
		status: newStatus,
		remarks: remarks || complaint.remarks
	}).eq("id", complaint.id);
	if (error) throw error;
	await supabase.from("status_history").insert({
		complaint_id: complaint.id,
		old_status: complaint.status,
		new_status: newStatus,
		changed_by: actorId,
		remarks: remarks || null
	});
	if (complaint.user_id) await notify(complaint.user_id, complaint.id, `${complaint.complaint_id} is now ${statusLabel(newStatus)}.`);
}
//#endregion
export { fetchDepartments as n, updateStatus as r, fetchComplaints as t };
