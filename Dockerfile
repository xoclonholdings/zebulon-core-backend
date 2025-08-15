
# ---- Builder Stage ----
FROM node:18-bullseye AS builder
WORKDIR /app
# Install all dependencies (including dev for TypeScript build)
COPY package*.json ./
RUN npm ci
# Copy source code and build TypeScript
COPY . .
RUN npm run build:server

# ---- Production Stage ----
FROM node:18-bullseye-slim AS production
WORKDIR /app
# Install only production dependencies
COPY package*.json ./
RUN npm ci --only=production
# Copy compiled output from builder stage
COPY --from=builder /app/dist ./dist
# Expose port and set entrypoint
EXPOSE 8080
CMD ["node", "dist/server/index.js"]
