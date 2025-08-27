# ---------- build stage ----------
FROM node:20-alpine AS build
WORKDIR /app

# Install required system packages
RUN apk add --no-cache rsync

# Install dependencies first (cached if package.json unchanged)
COPY package*.json ./
RUN npm ci

# Copy the rest of the source files
COPY tsconfig.json ./
COPY src ./src
COPY public ./public
COPY index.ts ./

# Transpile TypeScript
RUN npx tsc

# Copy EJS templates to dist
RUN rsync -avum \
    --include='*.ejs' \
    --include='*/' \
    --exclude='*' \
    ./src/ ./dist/src

# Copy public directory to dist
RUN rsync -avum \
    --include='*' \
    ./public/ ./dist/public

# ---------- runtime stage ----------
FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production

# Copy compiled output and production dependencies
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
COPY package*.json ./

EXPOSE 7000
CMD ["node", "dist/index.js"]