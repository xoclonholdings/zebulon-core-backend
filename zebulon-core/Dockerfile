FROM node:18

WORKDIR /app

# Install dependencies first for better cache
COPY package*.json ./
RUN npm install

# Copy source
COPY . .

# Build TS and Next.js, fail fast if build fails
RUN npm run build

EXPOSE 3000

CMD ["node", "dist/server/index.js"]
