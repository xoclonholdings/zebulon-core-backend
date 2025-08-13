# Zebulon Fullstack Dockerfile
FROM node:20-alpine AS base
WORKDIR /app

# Backend setup
COPY ./backend ./backend
WORKDIR /app/backend
RUN npm install

# Frontend setup
WORKDIR /app/frontend
COPY ./frontend ./frontend
RUN npm install && npm run build

# Final image
WORKDIR /app
COPY ./start-all.js ./start-all.js
EXPOSE 4000 3000
CMD ["node", "start-all.js"]
