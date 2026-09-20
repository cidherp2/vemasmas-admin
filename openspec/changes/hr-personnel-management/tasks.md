# Tasks

## 1. Project and UI foundation

- [x] 1.1 Add React Router, Tailwind CSS, Shadcn UI prerequisites, Lucide React, Supabase client, React Hook Form, Zod, TanStack Query, Vitest, and React Testing Library dependencies; verify installation completes and `npm run lint` still starts successfully.
- [x] 1.2 Configure Tailwind CSS, Shadcn UI tokens, light/dark theme variables, path aliases, and the shared `cn` utility; verify the existing Vite entry builds with `npm run build`.
- [x] 1.3 Replace the Vite starter surface with the planned `components`, `pages`, `hooks`, `services`, `types`, `lib`, and `routes` directories; verify all route and service import paths resolve under TypeScript strict mode.
- [x] 1.4 Add `.env.example` documenting `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` without adding secrets; verify no service-role key is referenced by browser code.

## 2. Supabase schema and generated contract

- [x] 2.1 Initialize the Supabase CLI directory with `npx supabase init` and create the initial migration from `npx supabase migration new create_persons_table`; verify the migration is tracked under `supabase/migrations`.
- [ ] 2.2 Implement the `0000_initial_schema.sql` migration content from `design.md`, including the `persons` table, phone and status checks, indexes, RLS, and authenticated CRUD policies; verify `npx supabase db reset` applies it successfully to a clean local instance.
- [ ] 2.3 Generate `src/types/database.types.ts` with `npx supabase gen types typescript --local`; verify the generated `Database` type includes the `persons` Row, Insert, and Update contracts and that no hand-written replacement is used.
- [ ] 2.4 Add a local database smoke test for authenticated CRUD and unauthenticated denial; verify RLS prevents reads and mutations without an authenticated Supabase session.

## 3. Authentication and routing

- [x] 3.1 Implement the typed Supabase client and auth service for sign-in, session restoration, auth state changes, and sign-out; verify service errors are mapped to typed application errors.
- [x] 3.2 Implement the auth provider and development fallback gated by `import.meta.env.DEV`; verify local unconfigured login is visibly simulated while a production-mode configuration failure cannot grant access.
- [x] 3.3 Add React Router routes for Login, Dashboard, Personas, and person detail plus a protected route boundary; verify unauthenticated private navigation redirects to Login and preserves its destination.
- [x] 3.4 Build the login page with required-field validation, accessible authentication feedback, loading state, and logout integration; verify invalid credentials do not expose whether the email or password was wrong.

## 4. Administrative shell

- [x] 4.1 Implement `AdminShell`, `Sidebar`, and `Header` with active route state, desktop collapse, mobile drawer, and profile menu; verify navigation works at desktop and mobile viewport sizes.
- [x] 4.2 Implement command palette navigation with Command-K or Control-K, Escape handling, focus management, and explicit header trigger; verify commands navigate to Dashboard and Personas without a full page reload.
- [x] 4.3 Implement light/dark theme switching and restoration before private content is interactive; verify readable contrast and theme restoration after reload in both supported themes.
- [x] 4.4 Add accessible labels, keyboard focus states, loading boundaries, and route-level error recovery to the shell; verify keyboard navigation reaches all primary actions without trapping focus.

## 5. Person data boundary

- [x] 5.1 Implement typed person models, Zod validation, service methods for list/get/create/update/delete, and error classification for duplicate email, network, HTTP, auth, RLS, and not-found cases; verify unit tests cover each mapped error category.
- [x] 5.2 Implement `usePersons` with query loading, retry, mutation invalidation, and duplicate-submission protection; verify successful mutations invalidate the list/detail data only after the service confirms success.
- [x] 5.3 Implement the responsive personnel table with required columns, stable loading skeletons, empty state, retry state, and detail navigation; verify successful, empty, loading, and read-error states are distinguishable.
- [x] 5.4 Implement real-time name/email search and combinable status filter with a clear-filters action; verify matching is case-insensitive and no-results state appears without a page reload.

## 6. Person workflows and forms

- [x] 6.1 Implement reusable `PersonForm` with create/edit defaults, required fields, email validation, exactly ten numeric phone digits, optional role, status, and inline messages; verify invalid submissions do not call the persistence service.
- [x] 6.2 Add create flow in a responsive Dialog or narrow-screen full-width surface; verify a successful create displays the new person, defaults status to active, and reports success.
- [x] 6.3 Add edit flow prefilled from the selected person; verify a successful update refreshes the table and detail view while a failed update preserves entered values.
- [x] 6.4 Add person detail page/card with identifier and creation timestamp plus edit and delete actions; verify a missing person renders the not-found state with return navigation.
- [x] 6.5 Add AlertDialog deletion confirmation and mutation feedback; verify cancelling sends no request and confirming removes the person only after a successful response.
- [x] 6.6 Add Sonner or Shadcn toast integration and accessible alerts for network, HTTP, auth, RLS, validation, and success outcomes; verify permission failures never appear as successful local mutations.

## 7. Verification and delivery

- [x] 7.1 Add component and route tests for login, protected navigation, fallback gating, shell responsiveness, and theme behavior; verify tests query accessible roles, labels, and text.
- [x] 7.2 Add form and person workflow tests using mocked service responses for validation, search/filter, create, edit, duplicate email, delete confirmation, loading, empty, and error states; verify the focused test suite passes.
- [ ] 7.3 Run local Supabase migration, type generation, lint, TypeScript build, and test commands from a clean checkout; verify all commands pass and generated types match the applied schema.
- [x] 7.4 Document the local and linked Supabase workflow, environment variables, migration filename decision, fallback limitations, and remote deployment guardrails; verify the README lets a new developer reproduce the local setup without secrets.
