# Use Node.js as the base image
FROM node:20-slim

WORKDIR /app

# Copy the entire workspace
COPY . .

# Install dependencies (including tsx and shared package dependencies)
RUN npm install

# Build shared package (optional but good for types/consistency)
RUN npm run build --workspace=@voteready/shared

EXPOSE 8080

# Run using tsx from the root to handle workspaces and imports correctly
CMD ["npm", "run", "start", "--workspace=@voteready/api"]
