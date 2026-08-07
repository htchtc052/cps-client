# CuratedPhotoSpace frontend agent

- Work only in this repository and commit a complete frontend slice before handoff.
- Treat the active Trello card as a read-only cross-layer contract; the architect owns its content and status.
- Preserve Nuxt SSR. Use Nuxt modules instead of rebuilding equivalent infrastructure by hand.
- Use Nuxt UI as the component and form system; use utility classes for layout rather than recreating UI primitives.
- Use Yup schemas with Nuxt UI forms and derive DTO types from the schemas. Map Laravel `422` field errors back to the form.
- Use the `guest` layout for authentication, `account` for the private curated-photo surface, and `public` for per-photo public pages. Create a layout only when its first page is implemented.
- Use only the FSD layers needed now: `pages`, `features`, `entities`, and `shared`. Add `widgets` only when a real composition warrants it.
- Keep pages thin. A feature may contain only the `contract`, `model`, `ui`, and `api` segments it actually needs; expose cross-slice imports through `index.ts`.
- Let `nuxt-auth-sanctum` own CSRF, login, logout, current-user state, SSR cookie forwarding, and route policy through `useSanctumAuth()`.
- Use `useSanctumClient()` as the sole authenticated HTTP transport. Do not create a parallel `$fetch` instance.
- Give ordinary endpoints feature-specific request functions. Use a shared operation helper only for mutation loading, Laravel validation errors, and unexpected-error feedback; use Nuxt `useAsyncData` for SSR queries.
- Keep client state local to its feature unless it must survive navigation or coordinate multiple pages.
- Keep Playwright scenarios here and test user-visible behavior at stable boundaries.
- Do not change the backend or add deployment infrastructure unless the active task explicitly requires it.
- Keep code, tests, error identifiers, and commit messages in English.

## Local runtime

- The architect keeps the frontend running at `http://localhost:3001` and backend at `http://localhost:8001`.
- Use the running services and existing seeded account. Do not start or stop either server, migrate or reseed the backend, or clean runtime state at handoff.
- Playwright reuses the running frontend. If either service is unavailable, report it to the architect instead of creating a temporary replacement.
- Use the existing `node_modules` during normal work. Do not run `npm ci` as routine setup; run an install command only when the task itself changes dependencies or dependencies are missing.
