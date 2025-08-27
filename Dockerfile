# ---------- build stage ----------
FROM node:20-alpine AS build
WORKDIR /app

# rsync is not in alpine by default
RUN apk add --no-cache rsync

# Install dependencies (npm). If you have a package-lock.json, this uses exact versions.
COPY package*.json ./
RUN npm ci

# Copy sources and build
COPY tsconfig.json ./
COPY src ./src
COPY public ./public
# (optional) if you reference anything in scripts during build, copy it:
COPY scripts ./scripts

# Transpile TypeScript
RUN npx tsc

# Copy EJS templates (and only those) from src -> dist/src using rsync
RUN mkdir -p dist && \
  rsync -avum --include='*.ejs' --include='*/' --exclude='*' ./src/ ./dist/src

# Copy entire public dir to dist/public
RUN rsync -avum --include='*' ./public/ ./dist/public

# ---------- runtime stage ----------
FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production

# Only production deps
COPY package*.json ./
RUN npm ci --omit=dev

# Bring compiled app
COPY --from=build /app/dist ./dist

# Expose app port (Render/Railway will inject PORT; your code uses it)
EXPOSE 7000

# Start the server
CMD ["node", "dist/index.js"]