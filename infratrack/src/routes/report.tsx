import { useEffect, useMemo, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Crosshair } from "lucide-react";
import { RequireAuth } from "@/components/RequireAuth";
import { AppShell } from "@/components/AppShell";
import { MapPanel } from "@/components/MapPanel";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { fetchDepartments } from "@/lib/complaints";
import {
  CATEGORIES,
  DEPARTMENT_FOR_CATEGORY,
  PRIORITIES,
  suggestPriority,
  type Category,
  type Priority,
} from "@/lib/infratrack";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/report")({
  head: () => ({
    meta: [
      { title: "Report an issue — InfraTrack" },
      {
        name: "description",
        content: "Report a pothole, streetlight, drain, garbage or water issue with an exact location.",
      },
      { property: "og:title", content: "Report an issue — InfraTrack" },
      { property: "og:description", content: "Send a civic issue straight to the right department." },
    ],
  }),
  component: () => (
    <RequireAuth>
      <AppShell title="Report an Issue">
        <ReportForm />
      </AppShell>
    </RequireAuth>
  ),
});

function ReportForm() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { data: departments = [] } = useQuery({
    queryKey: ["departments"],
    queryFn: fetchDepartments,
  });

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<Category>("road_pothole");
  const [priority, setPriority] = useState<Priority>("medium");
  const [touchedPriority, setTouchedPriority] = useState(false);
  const [address, setAddress] = useState("");
  const [area, setArea] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [picked, setPicked] = useState<{ lat: number; lng: number } | null>(null);
  const [busy, setBusy] = useState(false);

  const suggested = useMemo(
    () => suggestPriority(category, `${title} ${description}`),
    [category, title, description],
  );
  useEffect(() => {
    if (!touchedPriority) setPriority(suggested);
  }, [suggested, touchedPriority]);

  const departmentName = DEPARTMENT_FOR_CATEGORY[category];
  const department = departments.find((d) => d.name === departmentName);

  function useMyLocation() {
    if (!navigator.geolocation) {
      toast.error("Location is not available on this device.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => setPicked({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => toast.error("Could not read your location. Tap the map instead."),
    );
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!picked) {
      toast.error("Mark the location on the map first.");
      return;
    }
    setBusy(true);
    const { data, error } = await supabase
      .from("complaints")
      .insert({
        user_id: user!.id,
        title,
        description,
        category,
        priority,
        address,
        area: area || null,
        image_url: imageUrl || null,
        latitude: picked.lat,
        longitude: picked.lng,
        department_id: department?.id ?? null,
      })
      .select("id, complaint_id")
      .single();

    if (error || !data) {
      setBusy(false);
      toast.error(error?.message ?? "Could not submit the complaint.");
      return;
    }

    await supabase.from("status_history").insert({
      complaint_id: data.id,
      old_status: null,
      new_status: "pending",
      changed_by: user!.id,
      remarks: "Complaint submitted",
    });
    await supabase.from("notifications").insert({
      user_id: user!.id,
      complaint_id: data.id,
      message: `${data.complaint_id} received and sent to ${departmentName}.`,
    });

    setBusy(false);
    toast.success(`Complaint ${data.complaint_id} submitted.`);
    navigate({ to: "/complaints/$id", params: { id: data.id } });
  }

  const selectClass =
    "h-10 w-full rounded-md border bg-background px-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-ring";

  return (
    <form onSubmit={onSubmit} className="grid gap-6 lg:grid-cols-2">
      <div className="space-y-4 rounded-xl border bg-card p-5 shadow-card">
        <div className="space-y-1.5">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Large pothole near bus stop"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="desc">Description</Label>
          <Textarea
            id="desc"
            required
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What is wrong, how big is it, is anyone at risk?"
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="cat">Category</Label>
            <select
              id="cat"
              className={selectClass}
              value={category}
              onChange={(e) => setCategory(e.target.value as Category)}
            >
              {CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="prio">Priority</Label>
            <select
              id="prio"
              className={selectClass}
              value={priority}
              onChange={(e) => {
                setTouchedPriority(true);
                setPriority(e.target.value as Priority);
              }}
            >
              {PRIORITIES.map((p) => (
                <option key={p.value} value={p.value}>
                  {p.label}
                </option>
              ))}
            </select>
            <p className="text-xs text-muted-foreground">Suggested: {suggested}</p>
          </div>
        </div>
        <div className="rounded-lg bg-muted/50 p-3 text-sm">
          Will be sent to <strong>{departmentName}</strong>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="addr">Address / landmark</Label>
          <Input
            id="addr"
            required
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="MG Road, near Metro Pillar 42"
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="area">Area / ward (optional)</Label>
            <Input id="area" value={area} onChange={(e) => setArea(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="img">Photo link (optional)</Label>
            <Input
              id="img"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://…"
            />
          </div>
        </div>
        <Button type="submit" className="w-full" disabled={busy}>
          {busy ? "Submitting…" : "Submit complaint"}
        </Button>
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <p className="text-sm text-muted-foreground">
            Tap the map to mark the exact spot.
            {picked ? ` (${picked.lat.toFixed(4)}, ${picked.lng.toFixed(4)})` : ""}
          </p>
          <Button type="button" size="sm" variant="outline" className="ml-auto" onClick={useMyLocation}>
            <Crosshair className="mr-1.5 h-4 w-4" /> Use my location
          </Button>
        </div>
        <MapPanel
          height="520px"
          center={picked ? [picked.lat, picked.lng] : [20.5937, 78.9629]}
          zoom={picked ? 14 : 5}
          picked={picked}
          onPick={(lat, lng) => setPicked({ lat, lng })}
        />
      </div>
    </form>
  );
}
