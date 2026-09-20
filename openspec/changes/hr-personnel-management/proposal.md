# Proposal

## Why

The repository is currently an unmodified React/Vite starter and has no authenticated administrative workflow or personnel data model. This change establishes the first usable HR administration slice: authenticated users can navigate a responsive admin shell and manage people records backed by Supabase.

## What Changes

- Add a responsive Shadcn Admin-style shell with collapsible navigation, mobile drawer behavior, quick command palette, theme switching, and profile actions.
- Add email/password authentication with Supabase Auth, a clearly defined local fallback when Supabase configuration is absent, protected routes, session restoration, and logout.
- Add a people directory with list, search, filtering, detail, create, edit, and delete workflows.
- Define accessible loading, validation, network, HTTP, authentication, and RLS error states with inline messages, skeletons, and toast notifications.
- Establish the Supabase CLI workflow, initial `persons` schema, RLS policy model, generated TypeScript database contract, and frontend service boundaries.
- Add a deterministic local seed with synthetic personnel records and document schema-only synchronization to the approved remote Supabase project.
- Add the dependency and folder structure required for React Router, Tailwind CSS, Shadcn UI, Lucide icons, React Hook Form, and schema validation.

## Capabilities

### New Capabilities

- `admin-shell`: Responsive administrative layout, navigation, command palette, theme control, and profile menu behavior.
- `identity-access`: Login, Supabase session handling, optional simulated fallback, protected routes, and logout.
- `person-directory`: Personnel CRUD, table presentation, detail view, search, filters, form validation, and operation feedback.

### Modified Capabilities

None. The project has no existing capability specifications.

## Impact

- Frontend: replace the Vite starter surface with route-based React pages, reusable Shadcn UI primitives, layout components, person components, hooks, services, and typed models.
- Backend: initialize Supabase CLI configuration, create the initial PostgreSQL migration, enable RLS, and add policies for authenticated access to `persons`.
- Data delivery: reset local environments with 30 synthetic people and push only reviewed migrations/RLS to the linked remote project; local seed data is not included in `db push`.
- Tooling: add the required UI, routing, form, validation, Supabase, styling, and test dependencies; document local Supabase and type-generation commands.
- Security: authentication and database policies become prerequisites for all private person operations. The simulated login is limited to explicitly unconfigured local environments and must not be treated as production authentication.
