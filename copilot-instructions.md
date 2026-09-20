# GitHub Copilot Instructions

# React TypeScript Agent Rules

## Project Context

- Use React 19+ with TypeScript strict mode enabled in `tsconfig.json`.
- Use functional components exclusively — never class components.
- Use `vite` for local development and Vitest for testing; use Next.js for full-stack applications.
- Use `@tanstack/react-query` for server state and Zustand for complex client state.

## Code Style & Structure

- Name components in PascalCase, hooks with `use` prefix, and utilities in camelCase.
- Define prop interfaces above the component. Use `interface` for props, `type` for unions and aliases.
- Destructure props in function parameters and provide default values inline.
- Keep components under 100 lines. Extract reusable logic into custom hooks in `hooks/` directories.
- PREFER: named exports. Use default exports only for page-level route components.
- Co-locate tests, stories, and styles with the component file.

## TypeScript Patterns

- Enable `strict: true`, `noUncheckedIndexedAccess`, and `exactOptionalPropertyTypes` in `tsconfig.json`.
- DO NOT: use `any` — use `unknown` with type guards: `if (typeof val === 'string') { processString(val) }`.
- Use discriminated unions for component state machines: `type State = { status: 'idle' } | { status: 'error'; message: string }`.
- Use generic types for reusable hooks: `function useList<T>(initial: T[]): { items: T[]; add: (item: T) => void }`.
- Annotate all exported function return types explicitly — never rely on inference for public APIs.
- Use `React.ComponentProps<typeof Component>` to derive prop types when extending existing components.
- In React 19, `ref` is a regular prop — no `forwardRef` needed. Accept it directly in the props interface.

## Hooks

- Follow the Rules of Hooks strictly. Never call hooks inside conditions, loops, or nested functions.
- Use `useState` for simple local state; `useReducer` for complex state with multiple transitions.
- Use `useMemo` for expensive computations that depend on changing inputs — not for every value.
- Use `useCallback` for functions passed as props to memoized child components.
- Clean up effects properly — return a cleanup function from `useEffect` for subscriptions and timers.
- DO NOT: `useEffect` for derived state — compute during render instead.

## Component Patterns

- Use composition over configuration — prefer `children` over boolean props like `isLarge` or `isRound`.
- Use compound components with shared context for complex UI like `<Select>`, `<Tabs>`, and `<Accordion>`.
- Use `use(Context)` in React 19 instead of `useContext` — it can be called conditionally.
- Extract repeated JSX patterns into sub-components rather than helper render functions.
- Use `React.memo()` on components that receive stable primitive props and render frequently.

## Forms & Validation

- Use React Hook Form for form state management with Zod schemas for validation.
- Share Zod schemas between client validation and server-side parsing to guarantee consistency.
- Use `resolver: zodResolver(schema)` in `useForm` to connect RHF with Zod validation.
- Show inline error messages from `formState.errors`. Disable the submit button while `isSubmitting`.
- Use `useFormContext` from RHF for deeply nested form inputs to avoid prop drilling.

## State Management

- Keep state as close to its usage as possible — do not lift unnecessarily.
- Use React Context for cross-cutting concerns (theme, auth, locale) — not for frequently updating state.
- Use Zustand for global client state. Use TanStack Query for server-fetched data.
- DO NOT: store derived data in state — compute during render or in a selector.

## Error Handling

- Wrap feature subtrees with `ErrorBoundary` components for graceful failure recovery.
- Handle async errors in try/catch blocks inside event handlers and mutation callbacks.
- Show user-friendly error messages with a retry option — log full details to monitoring.
- Use typed custom error classes for domain-specific errors: `class NotFoundError extends Error { readonly code = 'NOT_FOUND' }`.

## Performance

- Lazy-load routes and heavy components with `React.lazy` and `<Suspense>`.
- Virtualize lists with TanStack Virtual for collections over 100 items.
- Use the React DevTools Profiler to identify components with costly renders before optimizing.

## Testing

- Write tests with Vitest and React Testing Library — test behavior, not implementation details.
- Query elements by accessible role, label, or text: `screen.getByRole('button', { name: /submit/i })`.
- Mock external dependencies with MSW for network calls and `vi.mock` for module-level mocking.
- Test custom hooks in isolation with `renderHook` from `@testing-library/react`.
