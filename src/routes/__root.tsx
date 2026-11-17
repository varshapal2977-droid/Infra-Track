import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";
import { AlertCircle, ArrowLeft, RefreshCw, ShieldAlert } from "lucide-react";

import appCss from "../styles.css?url";
import { AuthProvider } from "@/hooks/useAuth";
import { LanguageProvider } from "@/context/LanguageContext";
import { Toaster } from "@/components/ui/sonner";
import { Button } from "@/components/ui/button";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md rounded-2xl border bg-card p-8 text-center shadow-card">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-muted text-muted-foreground">
          <ShieldAlert className="h-7 w-7 text-primary" />
        </div>
        <p className="mt-4 font-mono text-sm font-semibold tracking-wider text-primary uppercase">Error 404</p>
        <h1 className="mt-1 font-display text-2xl font-bold tracking-tight text-foreground">
          Page not found
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          The requested civic page or report doesn't exist or has been relocated to another department view.
        </p>
        <div className="mt-6 flex justify-center">
          <Link to="/">
            <Button className="gap-2">
              <ArrowLeft className="h-4 w-4" /> Return to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error("Civic Portal Error:", error);
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md rounded-2xl border bg-card p-8 text-center shadow-card">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10 text-destructive">
          <AlertCircle className="h-7 w-7" />
        </div>
        <h1 className="mt-4 font-display text-xl font-bold tracking-tight text-foreground">
          Unable to load this section
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          We encountered an issue retrieving this page. You can refresh the view or head back to the main dashboard.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="gap-2"
          >
            <RefreshCw className="h-4 w-4" /> Try again
          </Button>
          <Link to="/">
            <Button variant="outline">
              Return Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1, maximum-scale=5" },
      { title: "InfraTrack | Civic Grievance & Resolution Portal" },
      {
        name: "description",
        content:
          "Official public platform to report, track, and resolve municipal infrastructure issues across city roads, streetlights, sanitation, and water systems.",
      },
      { property: "og:type", content: "website" },
      { property: "og:title", content: "InfraTrack | Civic Grievance & Resolution Portal" },
      {
        property: "og:description",
        content:
          "Official public platform to report, track, and resolve municipal infrastructure issues across city roads, streetlights, sanitation, and water systems.",
      },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "theme-color", content: "#163D2C" },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Manrope:wght@500;600;700;800&family=Noto+Sans+Devanagari:wght@400;500;600;700&display=swap",
      },
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.svg", type: "image/svg+xml" },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
      { rel: "apple-touch-icon", href: "/favicon.svg" },
      { rel: "manifest", href: "/manifest.json" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <AuthProvider>
          <Outlet />
          <Toaster richColors position="top-right" />
        </AuthProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
}
