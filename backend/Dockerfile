# Production Dockerfile for AI Spatial Platform Backend
FROM node:20-bookworm-slim AS base

WORKDIR /app

# Install Python 3 runtime and pre-compiled scientific libraries
RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 \
    python3-numpy \
    python3-scipy \
    python3-pil \
    python-is-python3 \
    && rm -rf /var/lib/apt/lists/*

# Copy package files and install dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy backend source code
COPY . .

# Expose backend server port
EXPOSE 5000

# Environment defaults
ENV PORT=5000
ENV NODE_ENV=production

# Start backend server
CMD ["node", "src/server.js"]
