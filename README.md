# CuratedPhoto frontend

Nuxt SSR frontend for CuratedPhoto.

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

## Checks

```sh
npm run lint
npm run typecheck
npm run test
```

Unit tests cover frontend logic such as error mapping; browser smokes and the production
build are run by the architect when the paired backend and frontend slices are accepted.
