FROM node:24-alpine AS build
WORKDIR /app
ARG NUXT_PUBLIC_API_BASE
ENV NUXT_PUBLIC_API_BASE=${NUXT_PUBLIC_API_BASE}
COPY package.json package-lock.json ./
# Реестр рвёт соединения при полной конкурентности npm: меньше сокетов, больше повторов.
ENV NPM_CONFIG_MAXSOCKETS=4 NPM_CONFIG_FETCH_RETRIES=5 NPM_CONFIG_FETCH_RETRY_MAXTIMEOUT=120000
RUN npm ci --no-audit --no-fund
COPY . .
RUN npm run build

FROM node:24-alpine
WORKDIR /app
ENV NODE_ENV=production
ENV NITRO_PORT=3000
ENV NITRO_HOST=0.0.0.0
COPY --from=build /app/.output ./.output
EXPOSE 3000
CMD ["node", ".output/server/index.mjs"]
