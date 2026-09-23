import { supabase } from "@/integrations/supabase/client";
import type { Status } from "@/lib/infratrack";
import { statusLabel } from "@/lib/infratrack";

export type Complaint = {
  id: string;
  complaint_id: string;
  user_id: string | null;
  title: string;
  description: string;
  category: string;
  priority: string;
  status: string;
  department_id: string | null;
  latitude: number;
  longitude: number;
  address: string;
  area: string | null;
  image_url: string | null;
  remarks: string | null;
  is_demo: boolean;
  created_at: string;
  updated_at: string;
  resolved_at: string | null;
};

export type Department = { id: string; name: string; description: string | null };

export async function fetchComplaints(filters?: { userId?: string }) {
  let q = supabase.from("complaints").select("*").order("created_at", { ascending: false });
  if (filters?.userId) q = q.eq("user_id", filters.userId);
  const { data, error } = await q;
  if (error) throw error;
  return (data ?? []) as Complaint[];
}

export async function fetchDepartments() {
  const { data, error } = await supabase.from("departments").select("*").order("name");
  if (error) throw error;
  return (data ?? []) as Department[];
}

export async function notify(userId: string, complaintId: string, message: string) {
  await supabase.from("notifications").insert({
    user_id: userId,
    complaint_id: complaintId,
    message,
  });
}

/** Update a complaint's status, log history and notify the reporter. */
export async function updateStatus(
  complaint: Complaint,
  newStatus: Status,
  remarks: string,
  actorId: string,
) {
  const { error } = await supabase
    .from("complaints")
    .update({ status: newStatus, remarks: remarks || complaint.remarks })
    .eq("id", complaint.id);
  if (error) throw error;

  await supabase.from("status_history").insert({
    complaint_id: complaint.id,
    old_status: complaint.status as Status,
    new_status: newStatus,
    changed_by: actorId,
    remarks: remarks || null,
  });

  if (complaint.user_id) {
    await notify(
      complaint.user_id,
      complaint.id,
      `${complaint.complaint_id} is now ${statusLabel(newStatus)}.`,
    );
  }
}
