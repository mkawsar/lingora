#!/bin/sh
set -e

# ================================
# Docker Entrypoint Script
# ================================

echo "🚀 Starting Lingora application..."

# Generate JWT secret
echo "🔐 Generating JWT secret..."
npm run generate:jwt-secret

# Run database migrations
echo "📦 Running database migrations..."
npm run migration:run

echo "✅ Setup complete!"

# Execute the main command
exec "$@"
