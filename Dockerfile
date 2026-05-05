# Use Playwright image for builder to allow running E2E tests during build
# Version should match package.json
FROM mcr.microsoft.com/playwright:v1.59.1-jammy AS builder

RUN apt-get update && apt-get install -y git && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

ARG VITEPRESS_BASE=/wiki/
ENV VITEPRESS_BASE=${VITEPRESS_BASE}

ARG EDIT_REPO=MUME/wiki
ENV EDIT_REPO=${EDIT_REPO}

ARG EDIT_BRANCH=main
ENV EDIT_BRANCH=${EDIT_BRANCH}

# Build the site
RUN npm run docs:build

# Run E2E tests to ensure the build is valid
# This makes tests "automatic" as part of the build process
RUN npm run test:e2e

FROM nginx:alpine

ARG VITEPRESS_BASE=/wiki/
# Create the directory structure for the base path so nginx serves it correctly
RUN mkdir -p /usr/share/nginx/html${VITEPRESS_BASE}
COPY --from=builder /app/docs/.vitepress/dist /usr/share/nginx/html${VITEPRESS_BASE}
# Also copy to root for simple health checks or if served without base
COPY --from=builder /app/docs/.vitepress/dist /usr/share/nginx/html

EXPOSE 80
