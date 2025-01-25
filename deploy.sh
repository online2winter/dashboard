#!/bin/bash

# Exit on error
set -e

# Check required environment variables
if [ -z "$REACT_APP_RPC_ENDPOINT" ]; then
    echo "Error: REACT_APP_RPC_ENDPOINT is not set"
    exit 1
fi

# Environment setup
echo "Setting up environment..."
NODE_ENV=production

# Install dependencies
echo "Installing dependencies..."
npm ci

# Run tests
echo "Running tests..."
npm test

# Build application
echo "Building application..."
npm run build

# Security checks
echo "Running security checks..."
npm audit

# Deploy to Netlify
echo "Deploying to Netlify..."
if [ "$BRANCH" = "main" ]; then
    netlify deploy --prod
else
    netlify deploy --message "Preview deploy from $BRANCH"
fi

echo "Deployment complete!"

