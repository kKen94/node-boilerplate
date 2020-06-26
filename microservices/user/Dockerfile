FROM node:12-alpine

ARG NODE_ENV
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package.json ./
COPY yarn.lock ./

RUN yarn install

COPY . .

EXPOSE 3001
CMD [ "yarn", "run", "dockerfile:cmd" ]

#FROM node:12 AS builder
#WORKDIR /app
#COPY ./package.json ./
#COPY yarn.lock ./
#RUN yarn install
#COPY . .
#RUN yarn run build
#
#
#FROM node:12-alpine
#WORKDIR /app
#COPY --from=builder /app ./
#ENTRYPOINT ["node", "index.js"]
