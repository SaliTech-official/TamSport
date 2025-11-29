FROM node:18-alpine as builder

WORKDIR /app

COPY ./frontend/tam_website/package*.json ./
RUN npm install
COPY ./frontend/tam_website .
RUN npm run build

FROM nginx:1.25-alpine as production

# Remove default nginx static files
RUN rm -rf /usr/share/nginx/html/*

# Copy built frontend
COPY --from=builder /app/dist /usr/share/nginx/html
# Copy custom nginx config
COPY ./docker/react/nginx.conf /etc/nginx/nginx.conf

EXPOSE 80