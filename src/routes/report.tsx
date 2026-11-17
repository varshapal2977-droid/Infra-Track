import { useEffect, useMemo, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  AlertCircle,
  Building2,
  CheckCircle2,
  Crosshair,
  Droplets,
  HardHat,
  ImageIcon,
  Info,
  Lightbulb,
  Loader2,
  MapPin,
  Send,
  Sparkles,
  Trash2,
  Wrench,
  X,
} from "lucide-react";
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
      { title: "Report an Infrastructure Issue — InfraTrack" },
      {
        name: "description",
        content:
          "Report a pothole, streetlight, drain, garbage, or water leakage with pinpoint GPS accuracy.",
      },
      { property: "og:title", content: "Report an Infrastructure Issue — InfraTrack" },
      {
        property: "og:description",
        content: "File a civic grievance directly to the assigned city department.",
      },
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

const categoryIcons: Record<string, typeof Wrench> = {
  road_pothole: Wrench,
  streetlight: Lightbulb,
  drainage: Droplets,
  garbage: Trash2,
  water_leakage: Droplets,
  traffic_signage: HardHat,
  public_property: Building2,
  other: Info,
};

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
  const [locating, setLocating] = useState(false);

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
      toast.error("Location services are not available on this device.");
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setPicked({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLocating(false);
        toast.success("GPS location locked!");
      },
      () => {
        setLocating(false);
        toast.error("Could not read GPS. Please tap your location directly on the map.");
      },
      { timeout: 10000, enableHighAccuracy: true },
    );
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!picked) {
      toast.error("Please mark the location on the map first before submitting.");
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
      remarks: "Complaint submitted by citizen",
    });
    await supabase.from("notifications").insert({
      user_id: user!.id,
      complaint_id: data.id,
      message: `${data.complaint_id} received and dispatched to ${departmentName}.`,
    });

    setBusy(false);
    toast.success(`Complaint ${data.complaint_id} filed successfully!`);
    navigate({ to: "/complaints/$id", params: { id: data.id } });
  }

  return (
    <div className="space-y-6">
      {/* Intro Header */}
      <div>
        <h2 className="font-display text-2xl font-bold tracking-tight text-foreground">
          File a Public Infrastructure Report
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Provide issue details and tap the map to pinpoint the exact location for field inspection crews.
        </p>
      </div>

      <form onSubmit={onSubmit} className="grid gap-8 lg:grid-cols-12 items-start">
        {/* Form Column */}
        <div className="space-y-6 lg:col-span-7">
          {/* Section 1: Category Picker */}
          <div className="rounded-2xl border border-border/80 bg-card p-6 shadow-card space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-bold text-foreground">1. Select Infrastructure Category</Label>
              <span className="text-xs text-muted-foreground">Required</span>
            </div>

            <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
              {CATEGORIES.map((cat) => {
                const Icon = categoryIcons[cat.value] ?? Info;
                const active = category === cat.value;
                return (
                  <button
                    key={cat.value}
                    type="button"
                    onClick={() => setCategory(cat.value)}
                    className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all duration-150 cursor-pointer ${active
                        ? "border-primary bg-primary/10 text-primary shadow-xs ring-2 ring-primary/20 font-semibold"
                        : "border-border/80 bg-muted/20 text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                      }`}
                  >
                    <Icon className="h-5 w-5 mb-1.5 shrink-0" />
                    <span className="text-xs line-clamp-1 leading-snug">{cat.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Department Routing Callout */}
            <div className="flex items-center gap-3 rounded-xl border border-primary/20 bg-primary/5 p-3.5 text-xs text-foreground">
              <Building2 className="h-5 w-5 text-primary shrink-0" />
              <div>
                <p className="font-semibold text-primary">Automatically dispatched to {departmentName}</p>
                <p className="text-muted-foreground text-[11px] mt-0.5">
                  Direct routing ensures work orders bypass delays and notify the right maintenance wing.
                </p>
              </div>
            </div>
          </div>

          {/* Section 2: Details & Description */}
          <div className="rounded-2xl border border-border/80 bg-card p-6 shadow-card space-y-4">
            <Label className="text-sm font-bold text-foreground">2. Issue Details</Label>

            <div className="space-y-1.5">
              <Label htmlFor="title" className="text-xs font-semibold text-foreground/80">
                Title / Headline
              </Label>
              <Input
                id="title"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Deep pothole causing heavy traffic slowdown"
                className="h-10 text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="desc" className="text-xs font-semibold text-foreground/80">
                Detailed Description
              </Label>
              <Textarea
                id="desc"
                required
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe what is broken, approximate dimensions, and whether it poses an immediate hazard to pedestrians or motorists."
                className="text-sm leading-relaxed"
              />
            </div>

            {/* Priority Selector & Smart Suggestion */}
            <div className="space-y-2 pt-1 border-t">
              <div className="flex items-center justify-between">
                <Label htmlFor="prio" className="text-xs font-semibold text-foreground/80">
                  Urgency & Priority
                </Label>
                <span className="flex items-center gap-1 text-[11px] font-medium text-primary">
                  <Sparkles className="h-3 w-3" /> System Suggested: <strong className="capitalize">{suggested}</strong>
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2">
                {PRIORITIES.map((p) => {
                  const active = priority === p.value;
                  return (
                    <button
                      key={p.value}
                      type="button"
                      onClick={() => {
                        setTouchedPriority(true);
                        setPriority(p.value);
                      }}
                      className={`py-2 px-3 rounded-lg border text-xs font-semibold capitalize transition-all cursor-pointer ${active
                          ? p.value === "high"
                            ? "border-destructive bg-destructive/15 text-destructive ring-2 ring-destructive/20"
                            : p.value === "medium"
                              ? "border-primary bg-primary/15 text-primary ring-2 ring-primary/20"
                              : "border-muted-foreground/40 bg-muted text-foreground"
                          : "border-border/70 bg-card text-muted-foreground hover:bg-muted/40"
                        }`}
                    >
                      {p.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Section 3: Location Details & Photo */}
          <div className="rounded-2xl border border-border/80 bg-card p-6 shadow-card space-y-4">
            <Label className="text-sm font-bold text-foreground">3. Location & Media</Label>

            <div className="space-y-1.5">
              <Label htmlFor="addr" className="text-xs font-semibold text-foreground/80">
                Street Address / Landmark
              </Label>
              <Input
                id="addr"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="e.g. 100ft Road, opposite Metro Pillar 42"
                className="h-10 text-sm"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="area" className="text-xs font-semibold text-foreground/80">
                  Ward / Area (Optional)
                </Label>
                <Input
                  id="area"
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  placeholder="e.g. Indiranagar Ward 12"
                  className="h-10 text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="img" className="text-xs font-semibold text-foreground/80">
                  Photo URL (Optional)
                </Label>
                <Input
                  id="img"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="h-10 text-sm"
                />
              </div>
            </div>

            {/* Real-time photo thumbnail preview */}
            {imageUrl.trim() ? (
              <div className="relative mt-2 overflow-hidden rounded-xl border border-border/80 bg-muted/40 p-2">
                <div className="flex items-center gap-3">
                  <img
                    src={imageUrl}
                    alt="Preview of issue photo"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = "none";
                    }}
                    className="h-16 w-16 rounded-lg object-cover border"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium text-foreground">Photo preview attached</p>
                    <p className="truncate text-[11px] text-muted-foreground">{imageUrl}</p>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => setImageUrl("")}
                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ) : null}

            {/* Submission CTA */}
            <div className="pt-2">
              <Button type="submit" size="lg" className="w-full gap-2 font-bold shadow-sm" disabled={busy}>
                {busy ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Submitting Work Order...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" /> Submit Civic Complaint
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Map Geolocation Column */}
        <div className="space-y-4 lg:col-span-5 lg:sticky lg:top-20">
          <div className="rounded-2xl border border-border/80 bg-card p-5 shadow-card space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <Label className="text-sm font-bold text-foreground">4. Pinpoint Exact Spot</Label>
                <p className="text-xs text-muted-foreground">Click anywhere on the map below</p>
              </div>

              <Button
                type="button"
                size="sm"
                variant="outline"
                className="gap-1.5 text-xs font-medium shadow-2xs"
                onClick={useMyLocation}
                disabled={locating}
              >
                {locating ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" /> Locking GPS...
                  </>
                ) : (
                  <>
                    <Crosshair className="h-3.5 w-3.5 text-primary" /> Use My GPS
                  </>
                )}
              </Button>
            </div>

            {/* Coordinates Status Pill */}
            {picked ? (
              <div className="flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-xs font-semibold text-emerald-800 dark:text-emerald-300">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
                <span>
                  Coordinates Locked: {picked.lat.toFixed(4)}°N, {picked.lng.toFixed(4)}°E
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-2 rounded-xl border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-xs text-amber-800 dark:text-amber-300">
                <AlertCircle className="h-4 w-4 shrink-0 text-amber-600" />
                <span>No location marked yet. Click on the map to place a pin.</span>
              </div>
            )}

            <div className="overflow-hidden rounded-xl border">
              <MapPanel
                height="460px"
                center={picked ? [picked.lat, picked.lng] : [20.5937, 78.9629]}
                zoom={picked ? 15 : 5}
                picked={picked}
                onPick={(lat, lng) => setPicked({ lat, lng })}
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
