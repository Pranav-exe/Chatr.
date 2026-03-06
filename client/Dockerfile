# ---------- Base Stage ----------
FROM node:20-alpine AS base
WORKDIR /app
COPY client/package*.json ./

# ---------- Development Stage ----------
FROM base AS development
RUN npm install
COPY client/ ./
EXPOSE 3000
CMD ["npm", "run", "dev"]

# ---------- Build Stage ----------
FROM base AS build
RUN npm ci --legacy-peer-deps
COPY client/ ./
RUN npm run build

# ---------- Production Stage ----------
FROM nginx:alpine AS production
# Copy compiled static files
COPY --from=build /app/dist /usr/share/nginx/html
# Copy custom Nginx configuration
COPY nginx/nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]