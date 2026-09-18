# ==========================================
# STAGE 1: Build Vue SPA Frontend
# ==========================================
FROM node:20-alpine AS frontend-builder
WORKDIR /app

# Copy root dependency manifests
COPY package*.json ./
RUN npm ci

# Copy full source and build static bundle
COPY . .
RUN npm run build

# ==========================================
# STAGE 2: Production Node.js + Express
# ==========================================
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Copy root dependency files and install production dependencies
COPY package*.json ./
COPY backend/package*.json ./backend/
RUN npm ci --only=production && cd backend && npm ci --only=production

# Copy backend application code
COPY backend ./backend

# Copy built frontend dist from Stage 1 into server path
COPY --from=frontend-builder /app/dist ./dist

EXPOSE 3000

# Health check endpoint
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:3000/api/properties || exit 1

# Start unified Node Express server
CMD ["node", "backend/server.js"]
