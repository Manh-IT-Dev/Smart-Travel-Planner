# Stage 1: Build stage
FROM node:24-alpine AS builder

WORKDIR /app

# Copy package files and lockfile
COPY package*.json ./

# Install all dependencies (production + dev dependencies)
RUN npm ci

# Copy the remaining project files
COPY . .

# Build both client and server assets
RUN npm run build

# Stage 2: Run stage
FROM node:24-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Copy necessary runtime artifacts from build stage
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist

# Install ONLY production dependencies to keep the image slim
RUN npm ci --only=production

# Expose the designated application port
EXPOSE 3000

# Start the full-stack server
CMD ["npm", "start"]
