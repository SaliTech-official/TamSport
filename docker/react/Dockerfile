FROM node:18-alpine AS builder

WORKDIR /app

COPY ./frontend/tam_website/package*.json ./
RUN npm install
COPY ./frontend/tam_website .
RUN npm run build

FROM nginx:stable

# Remove default nginx static files
RUN rm -rf /usr/share/nginx/html/*

# Copy built frontend from previous stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom nginx config
COPY ./docker/react/nginx.conf /etc/nginx/nginx.conf

EXPOSE 80