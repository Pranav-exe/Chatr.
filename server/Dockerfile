# ---------- Base Stage ----------
FROM node:20-alpine AS base
WORKDIR /app
COPY package*.json ./

# ---------- Development Stage ----------
FROM base AS development
RUN npm install
COPY . .
EXPOSE 5001
CMD ["npm", "run", "dev"]

# ---------- Build Stage ----------
FROM base AS build
RUN npm install --include=dev
COPY . .
RUN npm run build

# ---------- Production Stage ----------
FROM node:20-alpine AS production
WORKDIR /app
ENV NODE_ENV=production

# Only copy what is needed to run the app
COPY package*.json ./
RUN npm ci --only=production

# Copy compiled files from build stage
COPY --from=build /app/dist ./dist

EXPOSE 5001
CMD ["node", "dist/server.js"]