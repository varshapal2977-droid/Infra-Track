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

const priorityColor: Record<string, string> = {
  high: "#c2410c",
  medium: "#1d4ed8",
  low: "#0f766e",
};

function pinIcon(priority: string) {
  const color = priorityColor[priority] ?? priorityColor["low"];
  return L.divIcon({
    className: "",
    html: `<span style="display:block;width:16px;height:16px;border-radius:9999px;background:${color};border:2px solid white;box-shadow:0 1px 4px rgba(0,0,0,.4)"></span>`,
    iconSize: [16, 16],
    iconAnchor: [8, 8],
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
  // Density = count of complaints within ~0.3 degrees, used to size the circle.
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
    <div className="overflow-hidden rounded-xl border shadow-card" style={{ height }}>
      <MapContainer center={center} zoom={zoom} style={{ height: "100%", width: "100%" }} scrollWheelZoom>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {onPick ? <ClickPicker onPick={onPick} /> : null}
        {picked ? <Marker position={[picked.lat, picked.lng]} icon={pinIcon("high")} /> : null}

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
            <Popup>
              <div className="space-y-1 text-sm">
                <p className="font-semibold">{c.complaint_id}</p>
                <p className="font-medium">{c.title}</p>
                <p className="text-muted-foreground">{c.description?.slice(0, 120)}</p>
                <p>
                  <strong>Category:</strong> {categoryLabel(c.category)}
                </p>
                <p>
                  <strong>Priority:</strong> {priorityLabel(c.priority)} &nbsp;
                  <strong>Status:</strong> {statusLabel(c.status)}
                </p>
                <p>
                  <strong>Location:</strong> {c.address}
                </p>
                <p>
                  <strong>Submitted:</strong> {formatDate(c.created_at)}
                </p>
                <Link to="/complaints/$id" params={{ id: c.id }} className="text-primary underline">
                  View details
                </Link>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
