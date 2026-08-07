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
- Do not add production state, delays, hydration flags, or branches solely to satisfy a test. Fix test synchronization or the underlying user-facing behavior.
- Give SSR forms safe native HTML semantics; do not depend on hydration guards to prevent unsafe submission.
- Add Vitest only for meaningful frontend logic such as state transitions, ordering, transformations, or error mapping. Do not test framework behavior, UI libraries, declarative schemas, or trivial request functions.
- Do not change the backend or add deployment infrastructure unless the active task explicitly requires it.
- Keep code, tests, error identifiers, and commit messages in English.
- Do not add code comments. The only exceptions are a specific comment explicitly approved by the user or architect, or a concrete comment beginning with `TODO:` for intentionally unfinished work.

## Layout specialist

- A layout specialist may make a separate visual commit after a functional slice. Preserve its contracts, state flow, API calls, and route behavior unless the task explicitly includes them.
- Treat this section as the small, evolving set of agreed layout principles. Discuss material additions with the user and architect instead of inventing a design system inside a feature.
- Use Nuxt UI primitives and established tokens. Use utility classes for explicit structure, spacing, and responsive behavior; avoid arbitrary visual constants and premature shared components.
- Review the running route before and after changes at wide and narrow viewports. Check hierarchy, content width, spacing rhythm, typography, focus, loading, validation, and error states that exist in the slice.
- Use browser inspection and screenshots as temporary review tools. Keep screenshots, traces, reports, and browser test files outside the repository.
- Visual acceptance is a joint pass with the user led by the architect or layout specialist. They provide a clickable live URL, credentials when needed, and a short path; the user inspects the application in their own browser. Add durable layout decisions to this section only after that review.

## Handoff

- Give the architect the commit and at most five files worth reading by hand, ordered as applicable: page or layout, feature model, feature UI, validation contract, and meaningful test. Do not pad the list with generated files or configuration.
- State the route and user actions now available, including any relevant SSR or hydration boundary and known limitation. The architect curates the final frontend reading list and gives the user the live inspection link and manual path.

## Verification

- The frontend agent owns lint, typecheck, and unit tests relevant to the changed logic. A slice with no meaningful unit-testable logic may have no tests.
- The architect owns cross-stack browser smokes and the production build when accepting the paired backend/frontend result.
- Do not add or run Playwright, start a production build, or manufacture tests as a routine frontend handoff ritual.

## Local runtime

- The architect keeps the frontend running at `http://localhost:3001` and backend at `http://localhost:8001`.
- Use the running services and existing seeded account. Do not start or stop either server, migrate or reseed the backend, or clean runtime state at handoff.
- If either service is unavailable, report it to the architect instead of creating a temporary replacement.
- Use the existing `node_modules` during normal work. Do not run `npm ci` as routine setup; run an install command only when the task itself changes dependencies or dependencies are missing.
