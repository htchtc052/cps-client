# CuratedPhoto frontend agent

## Style

- Keep code, tests, error identifiers, and commit messages in English.
- Do not add code comments. The only exceptions are a comment explicitly approved by the user, or one beginning with `TODO:` for intentionally unfinished work.
- Prefer framework-native code over wrappers, fallbacks, or speculative abstractions.

## Structure

- Preserve SSR. Use Nuxt modules instead of rebuilding equivalent infrastructure by hand.
- FSD layers: `pages`, `features`, `entities`, `shared`. Add `widgets` only for a real composition.
- Keep pages thin. A feature holds only the `contract`, `model`, `ui`, and `api` segments it needs, and exposes cross-slice imports through `index.ts`.
- Keep client state local to its feature unless it must survive navigation or coordinate pages.

## Data

- Let `nuxt-auth-sanctum` own CSRF, login, logout, current-user state, SSR cookie forwarding, and route policy.
- Use `useSanctumClient()` as the sole HTTP transport. Do not create a parallel `$fetch` instance.
- Give each feature its own request functions. Use `useAsyncData` for SSR queries and the shared operation helper for mutations, validation errors, and error feedback.
- Use Yup schemas with Nuxt UI forms, derive DTO types from the schemas, and map Laravel `422` errors back to the form.

## Appearance

- Use Nuxt UI components and their props before writing utility classes, and never an inline `style` attribute.
- Layouts: `guest` for authentication, `account` for the private surface, `public` for per-photo pages.
- Design desktop-first. Narrow viewports must stay usable, not optimized.
- Content-led and structural: generous image area, restrained chrome, obvious layout over decoration.
- The palette is fixed in `app.config.ts` and locked to light mode. Do not branch styling on the system scheme or add a theme switcher.
- Keep utility class lists short. A long list is a signal to use a Nuxt UI component instead.

## Tests

- Add Vitest only for meaningful logic: state transitions, ordering, transformations, error mapping. Do not test framework behavior, UI libraries, or declarative schemas.
- Do not add production state, branches, or delays solely to satisfy a test.

## Delivery

- Commit and push frontend changes only in this repository. A push to `main` automatically publishes `cps-client:latest`; it does not deploy it.
- After pushing, find and watch the publish run with `gh run list --repo htchtc052/cps-client --workflow publish-image.yml --limit 1` and `gh run watch <run-id> --repo htchtc052/cps-client`.
- Deploy production only when the user explicitly asks. Run `gh workflow run deploy-frontend.yml --repo htchtc052/lab-infra --ref main`, find its ID with `gh run list --repo htchtc052/lab-infra --workflow deploy-frontend.yml --limit 1`, then watch that ID.
- The deploy workflow recreates only the frontend container and checks the public application URL.
- Operational procedures live in `lab-infra/DEPLOY.md`.
