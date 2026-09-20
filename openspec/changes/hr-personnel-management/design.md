# Design

## Context

The repository is a minimal Vite React application with no application routes, backend client, database schema, styling system, or test harness. See `proposal.md` for the motivation and `specs/` for the observable contracts. The implementation must preserve the existing TypeScript/React conventions, use the current React 19 runtime (which satisfies the React 18+ requirement), and keep the first release limited to authenticated personnel administration.

## Goals / Non-Goals

**Goals:**

- Establish a responsive Shadcn Admin-style shell that can host future HR modules.
- Keep route protection, authentication state, database access, validation, and UI feedback behind explicit boundaries.
- Use Supabase Auth and the typed PostgreSQL client with RLS as the source of truth for person records.
- Make local development possible from a clean Supabase instance and provide reproducible type generation.
- Provide a migration and folder layout that can be implemented incrementally and tested at each boundary.

**Non-Goals:**

- Role-based permissions beyond the requirement that the caller is authenticated.
- Employee self-service, payroll, attendance, documents, audit logs, invitations, or multi-tenant organization management.
- A custom backend server, server-side rendering, or a service-role key in the browser.
- Simulated authentication in production or persistence of simulated users in Supabase.

## Decisions

### 1. React 19 + TypeScript with Tailwind CSS and Shadcn UI

Use the repository's current React 19 setup, TypeScript, Tailwind CSS, and Shadcn UI primitives. Shadcn components are source-controlled in `src/components/ui`, which keeps visual behavior accessible and locally customizable. Lucide React supplies navigation and action icons.

Alternative considered: adopting a large component library. Rejected because it would introduce a second design language and make the Shadcn Admin reference harder to match.

### 2. Route topology and private boundary

Use React Router v6+ with this route map:

```text
/login
/
/dashboard
/persons
/persons/:personId
```

`/` redirects to `/dashboard`. A `ProtectedRoute` boundary checks the auth state before rendering private routes and preserves an unauthenticated user's intended destination. The admin shell wraps private routes, while Login remains outside it.

Lazy-load route pages behind `Suspense` so the shell does not need to load every page at startup. A route-level error boundary converts unexpected page failures into an accessible recovery state.

### 3. Authentication and configuration boundary

Create one browser Supabase client from `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`. The service client may use the public anonymous key only; a service-role key is never accepted by frontend code. Auth session changes are subscribed to once by an auth provider and exposed to the route boundary and header profile menu.

The fallback is selected only when both public Supabase values are absent and `import.meta.env.DEV` is true. It is visibly labeled as simulated mode, stores a browser-local development session, and never calls the database. A production build with absent configuration fails closed with a configuration state.

Alternative considered: always showing simulated login when Supabase fails. Rejected because a backend outage or a malformed production configuration must not silently bypass authentication.

### 4. Typed Supabase service layer

Keep UI components free of database queries. The service boundary is:

```text
src/services/supabase.ts       -> configured Supabase client
src/services/auth.service.ts   -> sign in, session, sign out
src/services/persons.service.ts -> list, get, create, update, remove
src/hooks/useAuth.ts           -> auth state for React consumers
src/hooks/usePersons.ts        -> query and mutation state for person flows
```

Use `@supabase/supabase-js` with the generated `Database` type for Auth and PostgreSQL access. The person service normalizes emails to lowercase, maps Supabase errors into typed domain errors, and preserves database errors such as duplicate email and RLS denial for the UI to classify. The UI calls hooks, not Supabase directly.

The service abstraction keeps the API transport replaceable. The default transport is the typed Supabase client, which uses the browser Fetch API internally and applies the current auth token to PostgREST requests. A direct Fetch adapter is not needed for the first release, but the service interface leaves that option open.

### 5. Server state and form state

Use React hooks and context for auth and theme state. Use TanStack Query for server-fetched people data and mutation lifecycle so loading, retry, invalidation, and stale data behavior are consistent. Keep filter text and selected status local to the directory page; derive the visible list from query data and filters rather than storing duplicate derived state.

Use React Hook Form with Zod for the reusable `PersonForm`. The same schema defines required fields, email format, and the ten-digit phone rule. The form submits a typed create or update payload and maps database conflicts back to field or form-level feedback.

Alternative considered: manually managing every form field with `useState`. Rejected because create and edit need the same validation, reset, submission state, and field-level error behavior.

### 6. Component and route structure

The implementation should converge on the following structure:

```text
supabase/
  config.toml
  migrations/
    0000_initial_schema.sql
src/
  components/
    ui/                         # Shadcn primitives
    layout/
      AdminShell.tsx
      Sidebar.tsx
      Header.tsx
      CommandPalette.tsx
      ProfileMenu.tsx
    persons/
      PersonsTable.tsx
      PersonForm.tsx
      PersonFormDialog.tsx
      DeletePersonDialog.tsx
      PersonDetailCard.tsx
      PersonFilters.tsx
  pages/
    LoginPage.tsx
    DashboardPage.tsx
    PersonsPage.tsx
    PersonDetailPage.tsx
  hooks/
    useAuth.ts
    usePersons.ts
  services/
    supabase.ts
    auth.service.ts
    persons.service.ts
  types/
    database.types.ts
    person.ts
  lib/
    validation.ts
    errors.ts
    utils.ts
  routes/
    AppRoutes.tsx
    ProtectedRoute.tsx
```

`PersonForm` is shared by create and edit. The create flow can open it in a Dialog on desktop and a full-width, navigable surface on narrow screens. Detail uses a profile card with edit and delete actions. Tables use stable columns and responsive fallbacks so actions do not cause layout shifts.

### 7. Initial database migration and RLS

The canonical migration deliverable is `supabase/migrations/0000_initial_schema.sql`. Its content is:

```sql
create extension if not exists pgcrypto;

create table public.persons (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  email text not null unique,
  phone varchar(10) not null,
  role text,
  status text not null default 'active',
  constraint persons_phone_ten_digits check (phone ~ '^[0-9]{10}$'),
  constraint persons_status_allowed check (status in ('active', 'inactive'))
);

create index persons_name_lower_idx on public.persons (lower(name));
create index persons_email_lower_idx on public.persons (lower(email));

alter table public.persons enable row level security;

create policy "Authenticated users can read persons"
on public.persons for select
to authenticated
using (true);

create policy "Authenticated users can create persons"
on public.persons for insert
to authenticated
with check (true);

create policy "Authenticated users can update persons"
on public.persons for update
to authenticated
using (true)
with check (true);

create policy "Authenticated users can delete persons"
on public.persons for delete
to authenticated
using (true);
```

The phone check closes the gap between `varchar(10)` and the required exactly-ten-digit behavior. The frontend normalizes email casing before writes; the database `unique` constraint remains the authoritative conflict guard. All authenticated users can access the directory because no user-to-person ownership or role model is in scope. Adding HR roles later will require new policies and a capability change.

### 8. Supabase CLI workflow

From a clean default Supabase project:

```bash
npx supabase init
npx supabase start
npx supabase migration new create_persons_table
# Put the migration content above in the generated migration file.
npx supabase db reset
npx supabase gen types typescript --local > src/types/database.types.ts
npx supabase status
```

For a linked remote project, validate the local migration first, then use the repository's approved project reference and:

```bash
npx supabase link --project-ref "$SUPABASE_PROJECT_REF"
npx supabase db push
npx supabase gen types typescript --linked > src/types/database.types.ts
```

The command-generated timestamped migration name is normally preferred by Supabase. When the required deliverable name is `0000_initial_schema.sql`, the initial migration file is kept under that name before applying it, provided the CLI version accepts the filename ordering. The implementation task must verify the generated migration list and use the actual filename consistently.

### 9.1. Local seed and remote schema boundary

Keep `supabase/seed.sql` as a local-only, deterministic dataset of 30 synthetic `persons` records. Fixed UUIDs, unique demo emails, valid ten-digit phones, varied roles, and both allowed statuses make `supabase db reset` reproducible and useful for manually exercising search, filters, detail, edit, and delete flows. The seed uses an email conflict update so rerunning it is safe, but it is not production data.

The remote delivery boundary is schema-only. Link the approved project with `supabase link --project-ref "$SUPABASE_PROJECT_REF"`, review migration status and remote drift, then run `supabase db push`. `db push` applies migrations and RLS policies; it does not apply `seed.sql`. Remote sample data, if ever desired, requires a separately approved data import and is outside this scope.

Alternative considered: inserting sample rows through a migration. Rejected because demo data would become production schema history and would be difficult to remove safely.

### 9. Generated database type contract

`src/types/database.types.ts` is generated and must not be hand-edited. The relevant generated shape is expected to be equivalent to:

```ts
export type Database = {
  public: {
    Tables: {
      persons: {
        Row: {
          id: string;
          created_at: string;
          name: string;
          email: string;
          phone: string;
          role: string | null;
          status: string;
        };
        Insert: {
          id?: string;
          created_at?: string;
          name: string;
          email: string;
          phone: string;
          role?: string | null;
          status?: string;
        };
        Update: {
          id?: string;
          created_at?: string;
          name?: string;
          email?: string;
          phone?: string;
          role?: string | null;
          status?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
```

The exact output remains owned by the Supabase CLI. The implementation must regenerate it after the migration and compile the service layer against that output rather than copying this illustrative contract manually.

### 10. Error, loading, and feedback policy

Use stable loading placeholders for initial list/detail reads and disable mutation controls while a request is in flight. Convert typed service errors to user-facing messages:

```text
validation          -> inline FormMessage per field
invalid credentials -> login form alert
network/5xx         -> toast + retry action
409 duplicate email -> email field or form error
401/403/RLS         -> permission toast; refresh session when applicable
404                 -> not-found page/state
```

Do not clear successful data into an empty state when a refresh fails. Mutation invalidation occurs only after the service confirms success. Toasts supplement, rather than replace, inline form messages and accessible alerts.

### 11. Styling and responsive behavior

Configure Tailwind and Shadcn tokens for light and dark themes. Use the Shadcn Admin layout proportions as a reference but keep content areas fluid. The sidebar becomes an off-canvas drawer at the mobile breakpoint; tables switch to a compact responsive presentation or horizontal region owned by the table, never a page-wide overflow trap. Dialog content becomes a full-width surface on narrow screens when the form would otherwise be clipped.

## Risks / Trade-offs

- [Risk] Any authenticated Supabase user can read and mutate all persons because there is no role model. -> Mitigation: document this as an intentional first-release boundary, keep RLS enabled from the first migration, and schedule role-based policies as a separate capability before multi-role deployment.
- [Risk] A simulated login could accidentally become a production bypass. -> Mitigation: require `import.meta.env.DEV`, display an explicit local-only label, fail closed when production configuration is missing, and add a build-level test for the branch.
- [Risk] Supabase's default timestamped migration filename conflicts with the requested `0000_initial_schema.sql` deliverable. -> Mitigation: verify the CLI-generated filename and migration ordering during setup; keep one canonical migration and document any rename in the implementation task.
- [Risk] A database unique constraint is case-sensitive while users consider emails case-insensitive. -> Mitigation: normalize email input to lowercase before writes and map duplicate responses to a clear field error; add a case-insensitive unique index if product policy requires stronger enforcement.
- [Risk] Generated types drift from the applied schema. -> Mitigation: run type generation after every migration change and make the application build depend on a type-check using `database.types.ts`.
- [Risk] A large directory can make client-side filtering slow. -> Mitigation: keep the first release bounded to the requested directory; add server-side pagination/search before the data set grows beyond the agreed operational threshold.

## Migration Plan

1. Install frontend dependencies and initialize Tailwind/Shadcn configuration without changing the Supabase schema.
2. Run `supabase init`, create the initial migration, apply it to the local clean instance, and generate TypeScript types.
3. Implement and test auth/session boundaries before exposing private person routes.
4. Implement the typed person service, directory query, forms, detail, and mutation feedback.
5. Run lint, typecheck/build, unit/component tests, and a local Supabase smoke test covering login, CRUD, RLS denial without a session, and type generation.
6. Link the approved remote project and run `supabase db push` only after the local migration is verified.

For local rollback, use `supabase db reset` and regenerate types. For a remote database, do not delete production data as a rollback mechanism; deploy a corrective migration or restore from the project's backup process. The first migration is additive and can be superseded by corrective migrations.

## Open Questions

None. The remaining implementation choices are intentionally bounded by the decisions above; product changes such as HR roles or additional person fields should become separate requirements rather than implicit assumptions in this change.
