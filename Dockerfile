# Multi-stage Dockerfile for BestCity Application
# Stage 1: Build Frontend
FROM node:20-alpine AS frontend-builder

WORKDIR /app

# Install git (required for some npm dependencies)
RUN apk add --no-cache git

# Copy package files
COPY package*.json ./

# Remove prepare script (husky) for Docker builds
RUN npm pkg delete scripts.prepare

# Install ALL dependencies (including dev) for frontend build
RUN npm install && npm cache clean --force

# Copy frontend source
COPY src ./src
COPY public ./public
COPY index.html ./
COPY vite.config.js ./
COPY tailwind.config.js ./
COPY postcss.config.js ./

# Build frontend
RUN npm run build

# Stage 2: Production Image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Install git (required for some npm dependencies)
RUN apk add --no-cache git

# Install production dependencies only
COPY package*.json ./

# Remove prepare script (husky) for Docker builds
RUN npm pkg delete scripts.prepare

# Install dependencies
RUN npm install --production && npm cache clean --force

# Copy server code
COPY server ./server

# Copy built frontend from builder stage
COPY --from=frontend-builder /app/build ./frontend/build

# Create logs directory with proper permissions
RUN mkdir -p /app/logs && chmod 777 /app/logs

# Disable file logging in Docker (use console only)
ENV DISABLE_FILE_LOGGING=true

# Use non-root user
USER node

# Expose ports
EXPOSE 4000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:4000/', (res) => process.exit(res.statusCode === 200 ? 0 : 1))"

# Start the application
CMD ["node", "server/server.js"]
