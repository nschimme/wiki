FROM node:22-alpine AS builder

RUN apk add --no-cache git

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

ARG VITEPRESS_BASE=/
ENV VITEPRESS_BASE=${VITEPRESS_BASE}

RUN npm run docs:build

FROM nginx:alpine

COPY --from=builder /app/docs/.vitepress/dist /usr/share/nginx/html

EXPOSE 80
