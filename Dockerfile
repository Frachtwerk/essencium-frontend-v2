# syntax=docker/dockerfile:1

# ─── deps: install dependencies (cached layer) ───────────────────────
FROM node:24-alpine AS deps
WORKDIR /app
RUN corepack enable
COPY package.json pnpm-lock.yaml ./
# --ignore-scripts: skip all lifecycle/build scripts (husky prepare, native
# postinstalls). The production build needs none of them — esbuild ships a
# prebuilt platform binary — and this sidesteps pnpm's build-approval prompt.
RUN --mount=type=cache,id=pnpm,target=/root/.local/share/pnpm/store \
    pnpm install --frozen-lockfile --ignore-scripts

# ─── build: generate client + route tree, then vite build ────────────
# Hey-API (from backend/openapi.yaml) and the TanStack route tree are
# generated during `pnpm build`, so the gitignored src/generated/ and
# src/routeTree.gen.ts are produced here from scratch.
FROM node:24-alpine AS build
WORKDIR /app
RUN corepack enable
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Client-exposed env (VITE_*) is baked into the bundle at build time.
# Override per environment with --build-arg.
ARG VITE_API_URL=/api
ARG VITE_APP_ENV=production
ARG VITE_APP_URL=
ENV VITE_API_URL=$VITE_API_URL \
    VITE_APP_ENV=$VITE_APP_ENV \
    VITE_APP_URL=$VITE_APP_URL
RUN pnpm build

# ─── runtime: nginx serving the static SPA ───────────────────────────
# nginx-unprivileged runs as a non-root user and listens on :8080.
FROM nginxinc/nginx-unprivileged:1.27-alpine AS runner

# BACKEND_URL is substituted into the nginx config at container start
# (see nginx.conf.template). Point it at your Spring Boot backend.
# DNS_RESOLVER defaults to the Docker embedded DNS; override on k8s.
ENV BACKEND_URL=http://backend:8098 \
    DNS_RESOLVER=127.0.0.11
COPY nginx.conf.template /etc/nginx/templates/default.conf.template
COPY --from=build /app/dist/client /usr/share/nginx/html

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:8080/healthz || exit 1
