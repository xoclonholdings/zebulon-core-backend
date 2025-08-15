# ---- base ----
FROM node:18-bullseye AS base
WORKDIR /app
ENV NODE_ENV=production


# ---- build ----
FROM node:18-bullseye AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build:server

# ---- production ----
FROM node:18-bullseye AS production
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY --from=build /app/dist /app/dist
EXPOSE 8080
CMD ["node", "dist/server/index.js"]
