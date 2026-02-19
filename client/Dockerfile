FROM node:20-alpine AS base
WORKDIR /app
COPY package*.json ./
RUN npm ci --legacy-peer-deps
COPY . . 
RUN npm run build

FROM nginx:alpine AS production
COPY --from=base /app/dist /usr/share/nginx/html
COPY ./nginx/nginx.conf /etc/nginx/nginx.conf

