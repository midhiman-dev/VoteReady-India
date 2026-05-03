# ─── Builder Stage ────────────────────────────────────────────────────────────
FROM node:20-slim AS builder

WORKDIR /app

# Copy workspace manifests first for better layer caching
COPY package.json package-lock.json ./
COPY packages/shared/package.json ./packages/shared/
COPY services/api/package.json ./services/api/

# Install all dependencies (including devDependencies needed to build)
RUN npm ci

# Copy source code
COPY packages/shared/ ./packages/shared/
COPY services/api/ ./services/api/

# Build shared package first (API depends on its dist output)
RUN npm run build --workspace=@voteready/shared

# Build API package (produces dist/)
RUN npm run build --workspace=@voteready/api

# ─── Production Stage ─────────────────────────────────────────────────────────
FROM node:20-slim AS runtime

WORKDIR /app

# Copy workspace manifests for production install
COPY package.json package-lock.json ./
COPY packages/shared/package.json ./packages/shared/
COPY services/api/package.json ./services/api/

# Install production dependencies only (no devDependencies, no tsx)
RUN npm ci --omit=dev

# Copy built output from builder
COPY --from=builder /app/packages/shared/dist ./packages/shared/dist
COPY --from=builder /app/services/api/dist ./services/api/dist

EXPOSE 8080

# Start from compiled JS — no tsx in production
CMD ["node", "services/api/dist/server.js"]
