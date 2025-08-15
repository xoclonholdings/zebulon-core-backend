FROM node:18

WORKDIR /app

# Install dependencies first
COPY package*.json ./
RUN npm install

# Copy source
COPY . .

# Build TS to JS
RUN npm run build

# Expose port
EXPOSE 3000

# Start server
CMD ["npm", "start"]
