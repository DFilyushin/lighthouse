FROM node:lts-alpine

MAINTAINER dmitiry.filyushin@ya.ru

WORKDIR /app

COPY . /app

RUN yarn install && yarn build && rm -r node_modules

EXPOSE 3000

CMD yarn start
