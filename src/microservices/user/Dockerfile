FROM node:12-alpine AS builder
ARG NODE_ENV
ENV NODE_ENV=${NODE_ENV}
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn
COPY . .
RUN yarn run build

FROM node:12-alpine
WORKDIR /app
COPY --from=builder /app/dist ./
ENTRYPOINT ["node", "index.js"]
