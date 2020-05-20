FROM node:lts-alpine

MAINTAINER dmitiry.filyushin@ya.ru

WORKDIR /app/

COPY ./frontend/package.json ./frontend/yarn.lock /app/

RUN yarn install

COPY ./frontend/ /app/

RUN yarn build

EXPOSE 3000

CMD yarn start
