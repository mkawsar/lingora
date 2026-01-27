# ================================
# Base Stage
# ================================
FROM node:20-alpine AS base

# Install dependencies for native modules (bcrypt needs this)
RUN apk add --no-cache libc6-compat python3 make g++

WORKDIR /app

# ================================
# Dependencies Stage
# ================================
FROM base AS deps

# Copy package files
COPY package.json package-lock.json ./

# Install all dependencies
RUN npm ci

# ================================
# Development Stage
# ================================
FROM base AS development

WORKDIR /app

# Copy dependencies
COPY --from=deps /app/node_modules ./node_modules

# Copy source code
COPY . .

# Copy .env.example to .env
RUN cp .env.example .env

# Expose the application port
EXPOSE 3000

# Entrypoint for JWT secret generation and migrations
ENTRYPOINT ["sh", "docker/entrypoint.sh"]

# Start the application in development mode
CMD ["npm", "run", "start:dev"]
