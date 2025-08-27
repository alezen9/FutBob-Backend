# ---------- build stage ----------
FROM node:20-alpine AS build
WORKDIR /app

RUN apk add --no-cache rsync

COPY index.ts ./
COPY package*.json ./
COPY tsconfig.json ./
COPY src ./src
COPY public ./public
COPY scripts ./scripts

RUN npm run build

RUN npm prune --omit=dev

# ---------- runtime stage ----------
FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production

# Bring compiled app and pruned node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
COPY package*.json ./

EXPOSE 7000
CMD ["node", "dist/index.js"]