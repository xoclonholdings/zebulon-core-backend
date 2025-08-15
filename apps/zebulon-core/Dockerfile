# Zebulon MVP Dockerfile
FROM node:20-alpine AS base
WORKDIR /app

# Install backend dependencies
COPY package.json package-lock.json ./
RUN npm install --omit=dev

# Build backend (TypeScript)
COPY tsconfig.json ./
COPY server/ ./server/
RUN npm run build

# Install frontend dependencies and build
COPY client/package.json client/package-lock.json ./client/
WORKDIR /app/client
RUN npm install --omit=dev && npm run build

# Final image setup
WORKDIR /app
COPY dist/server ./dist/server
COPY client/.next ./client/.next
COPY client/public ./client/public
COPY client/package.json ./client/package.json
EXPOSE 5000 3000
CMD ["node", "dist/server/index.js"]
