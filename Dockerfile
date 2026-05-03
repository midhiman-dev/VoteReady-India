# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy the entire workspace
COPY . .

# Install all dependencies
RUN npm ci

# Explicitly build the shared package first so that apps/web can find its types
RUN npm run build --workspace=@voteready/shared

# Then build the rest of the workspaces
RUN npm run build

# Production stage
FROM node:20-alpine

WORKDIR /app

# Install 'serve' to run the static site
RUN npm install -g serve

# Copy built assets from builder for the web app
COPY --from=builder /app/apps/web/dist ./dist

# Expose port
EXPOSE 8080

# Start the server
CMD ["serve", "-s", "dist", "-l", "8080"]
