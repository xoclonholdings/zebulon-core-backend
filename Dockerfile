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

FROM deps AS build
COPY . .
RUN npm run build:server
RUN npm prune --production

# ---- runtime ----
FROM base AS runtime
WORKDIR /app
ENV PORT=8080
COPY --from=build /app/dist /app/dist
COPY --from=build /app/node_modules /app/node_modules
COPY package*.json ./
EXPOSE 8080
CMD ["node", "dist/server/index.js"]
