# ==============================================================================
# Multi-stage Dockerfile for Abhishek Singh Portfolio (React + Vite + TypeScript)
# ==============================================================================

# ------------------------------------------------------------------------------
# Stage 1: Build the static assets using Node.js
# ------------------------------------------------------------------------------
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies deterministically
COPY package.json package-lock.json ./
RUN npm ci

# Copy source code and configuration files
COPY . .

# Set optional base path (default to / for root domain in Docker, or /Portfolio/)
ARG VITE_BASE_PATH=/
ENV VITE_BASE_PATH=$VITE_BASE_PATH

# Compile TypeScript and bundle with Vite
RUN npm run build

# ------------------------------------------------------------------------------
# Stage 2: Serve production assets with ultra-lightweight Nginx
# ------------------------------------------------------------------------------
FROM nginx:1.27-alpine-slim AS runner

# Remove default nginx static assets
RUN rm -rf /usr/share/nginx/html/*

# Copy custom nginx configuration for SPA routing & caching
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy compiled production bundle from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose standard HTTP port
EXPOSE 80

# Container healthcheck
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost/ || exit 1

# Start Nginx in foreground
CMD ["nginx", "-g", "daemon off;"]

