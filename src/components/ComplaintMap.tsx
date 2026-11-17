import { useMemo } from "react";
import L from "leaflet";
import { MapContainer, TileLayer, Marker, Popup, CircleMarker, useMapEvents } from "react-leaflet";
import { Link } from "@tanstack/react-router";
import { categoryLabel, formatDate, priorityLabel, statusLabel } from "@/lib/infratrack";

export type MapComplaint = {
  id: string;
  complaint_id: string;
  title: string;
  description: string;
  category: string;
  priority: string;
  status: string;
  address: string;
  latitude: number;
  longitude: number;
  created_at: string;
};

const priorityColor: Record<string, { fill: string; ring: string }> = {
  high: { fill: "#C85344", ring: "rgba(200, 83, 68, 0.3)" },
  medium: { fill: "#C28A4A", ring: "rgba(194, 138, 74, 0.3)" },
  low: { fill: "#5D866C", ring: "rgba(93, 134, 108, 0.3)" },
};

function pinIcon(priority: string) {
  const c = priorityColor[priority] ?? priorityColor["low"];
  return L.divIcon({
    className: "custom-map-pin",
    html: `
      <div style="position:relative;width:22px;height:22px;display:flex;align-items:center;justify-content:center;">
        <span style="position:absolute;width:100%;height:100%;border-radius:9999px;background:${c.ring};animation:ping 2s cubic-bezier(0,0,0.2,1) infinite;"></span>
        <span style="position:relative;width:14px;height:14px;border-radius:9999px;background:${c.fill};border:2.5px solid #ffffff;box-shadow:0 2px 6px rgba(0,0,0,0.35);"></span>
      </div>
    `,
    iconSize: [22, 22],
    iconAnchor: [11, 11],
  });
}

function pickerPinIcon() {
  return L.divIcon({
    className: "custom-picker-pin",
    html: `
      <div style="position:relative;width:26px;height:26px;display:flex;align-items:center;justify-content:center;">
        <span style="position:absolute;width:100%;height:100%;border-radius:9999px;background:rgba(93, 134, 108, 0.4);animation:ping 1.5s cubic-bezier(0,0,0.2,1) infinite;"></span>
        <span style="position:relative;width:16px;height:16px;border-radius:9999px;background:#5D866C;border:3px solid #ffffff;box-shadow:0 3px 8px rgba(0,0,0,0.4);"></span>
      </div>
    `,
    iconSize: [26, 26],
    iconAnchor: [13, 13],
  });
}

function ClickPicker({ onPick }: { onPick: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      onPick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

export default function ComplaintMap({
  complaints = [],
  center = [20.5937, 78.9629],
  zoom = 5,
  height = "70vh",
  onPick,
  picked,
  density = false,
}: {
  complaints?: MapComplaint[];
  center?: [number, number];
  zoom?: number;
  height?: string;
  onPick?: (lat: number, lng: number) => void;
  picked?: { lat: number; lng: number } | null;
  density?: boolean;
}) {
  // Density calculation
  const densityPoints = useMemo(() => {
    return complaints.map((c) => {
      const near = complaints.filter(
        (o) =>
          Math.abs(o.latitude - c.latitude) < 0.3 && Math.abs(o.longitude - c.longitude) < 0.3,
      ).length;
      return { ...c, near };
    });
  }, [complaints]);

  return (
    <div className="relative overflow-hidden rounded-2xl border border-border/80 shadow-card" style={{ height }}>
      <MapContainer center={center} zoom={zoom} style={{ height: "100%", width: "100%" }} scrollWheelZoom>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {onPick ? <ClickPicker onPick={onPick} /> : null}
        {picked ? <Marker position={[picked.lat, picked.lng]} icon={pickerPinIcon()} /> : null}

        {density
          ? densityPoints.map((c) => (
            <CircleMarker
              key={c.id}
              center={[c.latitude, c.longitude]}
              radius={8 + c.near * 4}
              pathOptions={{
                color: "transparent",
                fillColor: c.near > 2 ? "#b91c1c" : c.near > 1 ? "#ea580c" : "#f59e0b",
                fillOpacity: 0.35,
              }}
            />
          ))
          : null}

        {complaints.map((c) => (
          <Marker key={c.id} position={[c.latitude, c.longitude]} icon={pinIcon(c.priority)}>
            <Popup className="infratrack-leaflet-popup">
              <div className="p-1 min-w-[220px] max-w-[280px]">
                <div className="flex items-center justify-between gap-2 border-b pb-2">
                  <span className="font-mono text-[11px] font-bold text-muted-foreground">{c.complaint_id}</span>
                  <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] font-semibold uppercase text-foreground/80">
                    {statusLabel(c.status)}
                  </span>
                </div>
                <div className="pt-2">
                  <h4 className="font-display text-sm font-bold text-foreground leading-snug">{c.title}</h4>
                  <p className="mt-1 line-clamp-2 text-xs text-muted-foreground leading-relaxed">
                    {c.description}
                  </p>
                </div>
                <div className="mt-2.5 space-y-1 text-[11px] text-muted-foreground border-t pt-2">
                  <div className="flex justify-between">
                    <span>Category:</span>
                    <span className="font-medium text-foreground">{categoryLabel(c.category)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Priority:</span>
                    <span className="font-medium capitalize text-foreground">{priorityLabel(c.priority)}</span>
                  </div>
                  <div className="truncate text-foreground/75 pt-0.5">
                    📍 {c.address}
                  </div>
                </div>
                <div className="mt-3 pt-2 border-t">
                  <Link
                    to="/complaints/$id"
                    params={{ id: c.id }}
                    className="block w-full text-center rounded-lg bg-primary py-1.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition-colors shadow-2xs"
                  >
                    View Complaint Record →
                  </Link>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
