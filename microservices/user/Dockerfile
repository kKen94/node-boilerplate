FROM node:12

ARG APP_ENV=dev
ENV APP_ENV=${APP_ENV}

ARG DB_URL=postgresql://postgres:postgres@postgres:5432/user
ENV DB_URL=${DB_URL}

ARG DB_SYNC=false
ENV DB_SYNC=${DB_SYNC}

WORKDIR /usr/src/app

COPY package.json ./
COPY yarn.lock ./

RUN yarn

COPY . .

EXPOSE 3001
CMD [ "yarn", "run", "docker:start" ]
