## Stage 1
FROM node as builder
WORKDIR /usr/app
COPY package*.json ./
RUN npm i
COPY . .
RUN npm run build

## Stage 2
FROM node
WORKDIR /usr/app
COPY package*.json ./
RUN npm i --production
COPY --from=builder /usr/app/dist .

EXPOSE 7000

CMD node index.js