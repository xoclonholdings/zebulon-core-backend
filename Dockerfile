# ---- Builder ----
FROM node:18 AS builder
WORKDIR /app
COPY package*.json ./
COPY . .
RUN npm install --production=false
RUN npm run build

# ---- Runner ----
FROM node:18-slim AS runner
WORKDIR /app
COPY --from=builder /app .
RUN npm prune --production
EXPOSE 3000
CMD ["npm", "start"]
