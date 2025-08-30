FROM node:18-alpine as builder

WORKDIR /app

COPY ./frontend/tam_website/package*.json ./
RUN npm install
COPY ./frontend/tam_website .
RUN npm run build

FROM nginx:1.25-alpine as production

RUN rm -rf /usr/share/nginx/html/*
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80