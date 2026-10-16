import { Suspense, lazy, useEffect, useState, type ComponentProps } from "react";

// Leaflet touches `window`, so the map only loads in the browser.
const ComplaintMap = lazy(() => import("./ComplaintMap"));

type Props = ComponentProps<typeof ComplaintMap>;

export function MapPanel(props: Props) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const placeholder = (
    <div
      className="flex items-center justify-center rounded-xl border bg-muted/40 text-sm text-muted-foreground"
      style={{ height: props.height ?? "70vh" }}
    >
      Loading map…
    </div>
  );

  if (!mounted) return placeholder;
  return (
    <Suspense fallback={placeholder}>
      <ComplaintMap {...props} />
    </Suspense>
  );
}
