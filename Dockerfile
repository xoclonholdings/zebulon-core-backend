# ---- base ----
FROM node:18-bullseye AS base
WORKDIR /app
ENV NODE_ENV=production

# ---- deps ----
FROM base AS deps
COPY package*.json ./
### If client exists, copy its package manifests manually in a RUN step below
RUN npm ci
RUN bash -lc 'if [ -f client/package.json ]; then cd client && npm ci; fi'

# ---- build ----
FROM deps AS build
COPY . .
# Build server always
RUN npm run build:server
# Build client only if it exists
RUN bash -lc 'if [ -f client/package.json ]; then cd client && npm run build; else echo "[skip] no client build"; fi'

# ---- runtime ----
FROM base AS runtime
WORKDIR /app
ENV PORT=8080
# Copy only what we need
COPY --from=build /app/dist /app/dist
COPY --from=deps /app/node_modules /app/node_modules
COPY package*.json ./
# Health
EXPOSE 8080
CMD ["node", "dist/server/index.js"]
