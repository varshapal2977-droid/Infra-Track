import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About InfraTrack — How Civic Complaints Are Handled" },
      {
        name: "description",
        content:
          "How InfraTrack routes citizen complaints to city departments, tracks status changes and publishes resolution analytics.",
      },
      { property: "og:title", content: "About InfraTrack" },
      {
        property: "og:description",
        content: "How citizen complaints move from report to resolution on InfraTrack.",
      },
    ],
  }),
  component: About,
});

function About() {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-3xl px-4 py-14 md:py-20">
        <Link to="/" className="text-sm text-primary hover:underline">
          ← Back home
        </Link>
        <h1 className="mt-5 font-display text-3xl font-semibold">About InfraTrack</h1>
        <p className="mt-4 text-muted-foreground">
          InfraTrack is a civic maintenance tracking platform that connects residents with the city
          departments responsible for public infrastructure.
        </p>

        <h2 className="mt-10 font-display text-xl font-semibold">How it works</h2>
        <ol className="mt-3 space-y-3 text-sm text-muted-foreground">
          <li>
            <strong className="text-foreground">1. Report.</strong> A resident describes the issue,
            picks a category and marks the exact spot on the map.
          </li>
          <li>
            <strong className="text-foreground">2. Route.</strong> The category decides the
            department, and the wording of the report suggests a priority — words like “hazard” or
            “overflow” raise it.
          </li>
          <li>
            <strong className="text-foreground">3. Resolve.</strong> Authorities move the complaint
            through Assigned, In Progress and Resolved, adding remarks that the reporter sees.
          </li>
          <li>
            <strong className="text-foreground">4. Review.</strong> Everyone can see the city map
            and analytics: volumes by category, department load and resolution rates.
          </li>
        </ol>

        <h2 className="mt-10 font-display text-xl font-semibold">Roles</h2>
        <p className="mt-3 text-sm text-muted-foreground">
          Citizens can report issues and follow their own complaints. Authority accounts can update
          any complaint, reassign departments and view analytics. Complaint data is protected by
          per-user access rules, so only the reporter or an authority can change a record.
        </p>

        <h2 className="mt-10 font-display text-xl font-semibold">Demo access</h2>
        <p className="mt-3 text-sm text-muted-foreground">
          Create a free account to report issues. To try the authority side, open your Profile page
          and enter the access code <code className="rounded bg-muted px-1.5 py-0.5">INFRA-ADMIN-2026</code>.
        </p>
      </div>
    </div>
  );
}
