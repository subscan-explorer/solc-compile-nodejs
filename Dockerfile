FROM node:17-slim

COPY . /app
WORKDIR /app

RUN yarn install

CMD npm run start

EXPOSE 5678