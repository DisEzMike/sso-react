FROM node:23.11.0-alpine

WORKDIR /app

COPY package*.json .
RUN yarn

COPY . .

RUN yarn build

EXPOSE ${PORT}
CMD ["yarn", "start"]