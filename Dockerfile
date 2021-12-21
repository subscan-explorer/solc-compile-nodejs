FROM node:17-slim

RUN mkdir /app
COPY . /app
WORKDIR /app

RUN yarn install

CMD npm run start

EXPOSE 5678