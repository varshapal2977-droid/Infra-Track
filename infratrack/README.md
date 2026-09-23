# InfraTrack — Civic Infrastructure Complaint Management

A full-stack web app for reporting and managing public infrastructure issues
(potholes, streetlights, water leaks, garbage, drainage, etc.) with citizen and
authority roles, GIS maps, analytics and notifications.

## Run it locally (2 commands)

Requirements: Node.js 20+ (or Bun).

```bash
npm install
npm run dev
```

Open http://localhost:8080

That's it. The `.env` file is already included and points at the live hosted
database, so the app works immediately with all 30 demo complaints, login,
maps and analytics.

## Demo logins

| Role                | Email                    | Password     |
| ------------------- | ------------------------ | ------------ |
| Citizen             | citizen@infratrack.app   | Infra@2026   |
| Authority (admin)   | admin@infratrack.app     | Infra@2026   |

Any new account can be upgraded to Authority by entering the access code
`INFRA-ADMIN-2026` on the Profile page.

## Build for production

```bash
npm run build
npm run preview
```

## Tech stack

- React 19 + TanStack Start (routing + SSR) + Vite 7
- Tailwind CSS v4 + shadcn/ui components
- Supabase (PostgreSQL + Auth + Row Level Security) as the backend
- Leaflet / React Leaflet for the GIS maps
- Recharts for analytics charts
- TanStack Query for data fetching

## Project structure

```
src/
  routes/            pages (file-based routing)
    index.tsx        landing page
    login.tsx        sign in
    register.tsx     sign up
    dashboard.tsx    citizen dashboard
    report.tsx       report an issue (map pin + auto priority)
    my-complaints.tsx
    complaints.$id.tsx  complaint detail + status timeline
    map.tsx          public city map with filters
    notifications.tsx
    profile.tsx      account + authority access code
    admin/           authority dashboard, complaints, analytics, departments
  components/        AppShell, ComplaintMap, Badges, StatCard, StatusTimeline
  hooks/useAuth.tsx  auth + role context
  lib/               complaint queries, categories, priorities, helpers
  integrations/supabase/  database client and generated types
db/schema.sql        full database schema + 30 demo complaints
supabase/migrations/ the same schema as ordered migrations
```

## Database

`db/schema.sql` contains everything: enums, tables, indexes, triggers,
row-level-security policies and the demo data.

Tables:

- `profiles` — user details, created automatically on signup
- `user_roles` — `citizen` / `admin` (kept separate from profiles for security)
- `departments` — Roads, Electrical, Water, Sanitation, Drainage, Public Works
- `complaints` — auto IDs like `INF-10001`, location, category, priority, status
- `status_history` — every status change with actor, remarks and timestamp
- `notifications` — per-user alerts when a complaint changes

## Using your own database instead

1. Create a new Supabase project (or any PostgreSQL with the Supabase stack).
2. Run `db/schema.sql` against it.
3. Replace the values in `.env` with your own project URL and publishable key:

```
VITE_SUPABASE_URL=https://<your-project>.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=<your-anon-or-publishable-key>
VITE_SUPABASE_PROJECT_ID=<your-project-ref>
```

4. Enable Email/Password sign-in in your project's Auth settings.

## Security notes

- Every table has Row Level Security enabled; citizens can only read/modify
  their own complaints and notifications, authorities can manage all.
- Roles live in a separate `user_roles` table and are checked through the
  `has_role()` security-definer function — never from client state.
- The client only ever holds the publishable (anon) key; privileged operations
  are gated by RLS policies in the database.

## API / data access

The frontend talks to PostgREST (Supabase) over HTTPS. Main operations:

| Operation           | Call                                                                 |
| ------------------- | -------------------------------------------------------------------- |
| List complaints     | `supabase.from('complaints').select('*')`                            |
| My complaints       | `.eq('user_id', user.id)`                                            |
| Create complaint    | `.insert({...})`                                                     |
| Update status       | `updateStatus(complaint, status, remarks, actorId)` in `src/lib/complaints.ts` |
| Departments         | `supabase.from('departments').select('*')`                           |
| Notifications       | `supabase.from('notifications').select('*').eq('user_id', id)`       |
| Claim authority     | `supabase.rpc('claim_admin_role', { _code })`                        |
