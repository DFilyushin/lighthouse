FROM node:12
MAINTAINER dmitiry.filyushin@ya.ru

COPY ./frontend /lighthouse/frontend


WORKDIR /lighthouse/frontend

RUN npm ci --only=production

EXPOSE 8000

CMD ["npm", "run-script" "start"]
