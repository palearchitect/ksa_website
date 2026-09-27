#!/bin/bash
# deploy.sh

# Install root dependencies
npm install --legacy-peer-deps

# Install backend dependencies
cd backend
npm install

# Fix permissions (if needed)
chmod +x ../node_modules/.bin/vite || true

# Build the frontend
cd ..
npm run build