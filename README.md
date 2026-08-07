# CuratedPhotoSpace frontend

Nuxt SSR frontend for CuratedPhotoSpace.

## Local setup

```sh
nvm use
npm ci
cp .env.example .env
npm run dev -- --port 3001
```

`NUXT_PUBLIC_API_BASE` points at the Laravel API (`http://localhost:8001`).
The session lives in cookies shared across both `localhost` ports, so the backend must
run on that origin and list `localhost:3001` in its Sanctum stateful domains.

Run the production check with `npm run build` and the types with `npm run typecheck`.

## End-to-end tests

```sh
npm run test:e2e
```

The smoke drives login, reload, and logout against a running frontend on port 3001 and a
seeded backend on port 8001; it starts neither.
