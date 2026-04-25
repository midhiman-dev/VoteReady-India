# Use Node.js as the base image
FROM node:20-slim AS builder

WORKDIR /app

# Copy the entire workspace to handle local dependencies
COPY . .

# Install dependencies and build
RUN npm install
RUN npm run build --workspace=@voteready/shared
RUN npm run build --workspace=@voteready/api

# Final stage
FROM node:20-slim

WORKDIR /app

# Copy built files and production dependencies
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/packages/shared/package.json ./packages/shared/
COPY --from=builder /app/packages/shared/dist ./packages/shared/dist
COPY --from=builder /app/services/api/package.json ./services/api/
COPY --from=builder /app/services/api/dist ./services/api/dist

# Install production dependencies only
RUN npm install --omit=dev

EXPOSE 8080

CMD ["npm", "run", "start", "--workspace=@voteready/api"]
