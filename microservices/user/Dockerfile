FROM node:12

ARG APP_ENV=dev
ENV APP_ENV=${APP_ENV}

WORKDIR /usr/src/app

COPY package.json ./
COPY yarn.lock ./

RUN yarn

COPY . .

EXPOSE 3001
CMD [ "yarn", "run", "docker:start" ]
