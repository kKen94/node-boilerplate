FROM node:12-alpine

ARG APP_ENV
ENV APP_ENV=${APP_ENV}

ARG DB_URL
ENV DB_URL=${DB_URL}

ARG DB_SYNC
ENV DB_SYNC=${DB_SYNC}

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
#CMD ["yarn", "run", "start"]
