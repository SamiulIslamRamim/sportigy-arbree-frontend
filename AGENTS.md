# AGENTS.md

Agent guidance for the **sportigy-arbree-frontend** repository. Read this before making changes.

## Context

Sporty is a sports-talent platform ("Spotig") that connects athletes ("players") with talent scouts / organizations. This repo is the **single-page React frontend**; the backend is a separate Django REST API.

- **Framework:** Vite + React 19 (SPA, no SSR; all routes use `ssr: false`).
- **Router:** TanStack Router with **file-based routing** driven by Vite plugin (`tanstackRouter`, auto code-splitting, `tsr generate`).
- **Data fetching:** TanStack React Query v5 (queries + mutations), Axios for HTTP.
- **Forms/validation:** React Hook Form + `@hookform/resolvers/zod` (Zod v4).
- **State:** Zustand stores (auth is persisted in-memory only; refresh token is an httpOnly cookie from the backend).
- **Styling:** Tailwind CSS v4 via `@tailwindcss/vite`, shadcn/ui (registry style `radix-nova`), var-based theme in `src/styles.css`, lucide-react icons.
- **Deployment:** Netlify (`public/_redirects` → `/* /index.html 200`).

## Main areas

- `/login`, `/register`, `/forgot-password`, `/verify-otp`, `/reset-password` — auth flows.
- `/` — landing.
- `/_authenticated/player/dashboard` — player home (partly mocked).
- `/_authenticated/org/dashboard` — organization scouting dashboard (mocked data).
- `/admin/login`, `/admin/_authed/dashboard` — separate admin portal (separate auth store + axios instance).

## Project structure

```
src/
  components/
    ui/          # shadcn/ui primitives (button, input, field, dialog, sheet, …)
  constants/     # categories.ts (sports, org types)
  features/<domain>/   # auth, admin, org, player
    api/         # api client functions (auth.api.ts, player.api.ts, …)
    components/  # feature-local components
    hooks/       # useQuery/useMutation wrappers + exported query keys
    schemas/     # zod schemas
    types/       # shared types + d.ts
    store/       # zustand stores (auth feature)
    utils/, lib/ # helpers (format, date, country, display-values)
  hooks/         # cross-feature hooks (auth.hooks, categories.hooks, useQueryClient)
  lib/
    api/axios.ts # shared axios instance + refresh interceptor + extractApiError
    utils.ts     # cn() (clsx + tailwind-merge)
    error-reporting.ts  # reportCustomError hook
  mock/          # in-memory mock data (org, player dashboards)
  routes/        # file-based routes (see Router section)
```

**Feature layout rule:** anything scoped to one domain lives under `src/features/<domain>/` partitioned into `api`, `components`, `hooks`, `schemas`, `types`, `store`, `utils`. Generic/cross-cutting code lives in `src/lib`, `src/hooks`, `src/components`. Route files stay thin: define the `Route`, then delegate to feature components/hooks.

## Commands

```bash
npm run dev              # vite dev on port 3000
npm run build            # production build (also runs route generation)
npm run generate-routes  # tsr generate (regenerate routeTree.gen.ts)
npm run lint             # eslint (tanstack config)
npm run format           # prettier --write . + eslint --fix
npm run check            # prettier --check .
npm test                 # vitest
```

Run `npm run lint` and `npm run format` (or at least `npm run check`) after editing. There are currently no test files.

## Code conventions

### Imports / aliases
- Both `@/` and `#/` map to `./src` (see `tsconfig.json` and `package.json` `imports`). **Prefer `#/`** for new imports; `@/` is used inside feature files (e.g. `@/lib/api/axios`).
- Prefer relative-free, alias-based imports.

### Formatting (prettier.config.js)
- No semicolons, single quotes, trailing commas `"all"`.
- The codebase has formatting drift; new code should match Prettier.

### TypeScript (strict)
- `strict: true`, `noUnusedLocals`, `noUnusedParameters`, `verbatimModuleSyntax`, `noFallthroughCasesInSwitch`.
- Use `import type` for type-only imports (enforced by verbatimModuleSyntax).
- Don't leave unused imports/variables — lint fails.

### Component conventions
- React 19 function components, no default exports.
- Feature components are Named Exports (e.g. `export function PlayerCard`); route files export `Route` via `createFileRoute`.
- Use shadcn UI primitives from `#/components/ui/*`; compose with `cn()`.
- Icons via `lucide-react`; loading states use `<Loader2 className="h-4 w-4 animate-spin" />`.

### Data fetching pattern
- API call lives in `features/<domain>/api/<name>.api.ts`, typed against `features/<domain>/types`.
- Query hook lives in `features/<domain>/hooks/<name>.ts`, exporting the query key (usually `export const xKey = ["..."] as const;`) for cross-file invalidation:
  ```ts
  export function usePlayerInformation() {
    return useQuery({ queryKey: playerInformationKey, queryFn: playerApi.getPlayerInformation })
  }
  ```
- Mutations: `useMutation` with `onSuccess` → `qc.invalidateQueries(...)` (or onSettled), `toast.success/error` from `sonner`, and `extractApiError(err, "fallback")` for error messages.

### API client (src/lib/api/axios.ts)
- Shared `api` axios instance: base `import.meta.env.VITE_API_BASE_URL` (fallback `http://localhost:5000`), `withCredentials: true`.
- Request interceptor injects `Bearer <accessToken>` from `useAuthStore`.
- Response interceptor auto-refreshes the access token on 401 and retries ONCE; on refresh failure calls `logout()` and redirects to `/login`. Do not bypass this flow.
- **Admin has its own isolated instance** `adminApi` in `src/features/admin/api/admin-auth.api.ts` with the same refresh behavior (redirects to `/admin/login`).

### State (Zustand)
- Read state non-reactively inside callbacks with `useAuthStore.getState()` (e.g. route `beforeLoad`). Use selector hooks in components: `useAuthStore((s) => s.user)`.
- Auth stores live in the feature (`features/auth/store/auth.store.ts`, `features/admin/auth/admin-auth.store.ts`).

### Routing (TanStack Router)
- File-based: `src/routes/**/*.tsx`; run `npm run generate-routes` after adding a route if needed.
- Guarded sections:
  - `/_authenticated` (`src/routes/_authenticated.tsx`) — verifies/restores session in `beforeLoad`, redirects to `/login` with `?redirect=`.
  - `/admin/_authed` (`src/routes/admin/_authed.tsx`) — admin verification gate, renders `AdminLayout`.
- All routes are SPA-only: use `ssr: false` in route config (keep that set on new routes).
- Role-based post-login redirect: `player` → `/player/dashboard`, `organization` → `/org/dashboard`, else `/dashboard`.
- Set page title/meta via route `head: () => ({ meta: [...] })`; admin pages add `{ name: "robots", content: "noindex" }`.

### Forms
- Always `react-hook-form` + `zodResolver(schema)` + `Controller` per field.
- Use `Field` / `FieldLabel` / `FieldError` / `FieldGroup` from `#/components/ui/field`; set `data-invalid={fieldState.invalid}` and `aria-invalid` on inputs.
- Validation schemas live in `features/<domain>/schemas/*.schema.ts`; derive payload types with `z.infer`.
- Password rules: min 8, upper+lower+digit+special (see `strongPassword` in `auth.schema.ts`).

### Mock vs real data
- `src/mock/*` supplies data for player + org dashboards. The org module (`org-banner.api.ts`) and `dashboard.api.ts` return `Promise.resolve(mock…)` — there is no backend wiring for these yet.
- Auth, admin, and player profile (`player.api.ts`) hit the real Django API.
- When replacing a mock API with a real one, keep the same hook/component signatures and swap only the api-layer function + types.

## Gotchas / constraints

- `.env` is git-ignored; only `VITE_API_BASE_URL` is expected. Never hardcode a backend URL beyond the localhost fallback in the axios modules, and never commit `.env`.
- Two router entry files exist: index.html loads `src/main.tsx` (which builds its own router from `routeTree.gen`). `src/router.tsx` (getRouter) is currently unused by the entrypoint — don't expect `router.tsx` to be wired up unless the entry changes.
- `src/style-new.css` is empty/unused; all styling is in `src/styles.css`.
- Do not add comments unless asked; keep new files consistent with existing style (semicolon-free, single quotes).
- Consistency matters: run `npm run format` and `npm run lint` before finishing to avoid drift.
- Do not delete the shadcn `ui/` primitives — they are generated/managed and other components depend on them.