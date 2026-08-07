# CuratedPhotoSpace frontend agent

- Work only in this repository and commit a complete frontend slice before handoff.
- Treat the active Trello card as a read-only cross-layer contract; the architect owns its content and status.
- Preserve Nuxt SSR and use established Nuxt modules before composing equivalent infrastructure by hand.
- Keep client state local to the feature unless it must survive navigation or coordinate multiple pages.
- Prefer direct framework APIs and explicit failures over wrappers, fallbacks, or speculative abstractions.
- Keep frontend structure proportional to the current slice; do not add unused FSD layers or extension points.
- Keep Playwright scenarios here and test user-visible behavior at stable boundaries.
- Do not change the backend or add deployment infrastructure unless the active task explicitly requires it.
- Keep code, tests, error identifiers, and commit messages in English.

