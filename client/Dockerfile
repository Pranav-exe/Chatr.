# ---------- Development Stage ----------
FROM node:20-alpine AS development
WORKDIR /app

COPY client/package*.json ./
RUN npm install

COPY client/ ./

EXPOSE 3000
CMD ["npm", "run", "dev"]


# ---------- Build Stage ----------
FROM node:20-alpine AS build
WORKDIR /app

COPY client/package*.json ./
RUN npm ci --legacy-peer-deps

COPY client/ ./
RUN npm run build


# ---------- Production Stage ----------
FROM nginx:alpine AS production

COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx/nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]