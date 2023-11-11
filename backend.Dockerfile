FROM node:18.17.0-bullseye-slim

WORKDIR /app
COPY package.json yarn.lock lerna.json jest.config.js ./
COPY packages/backend/package.json ./packages/backend/
RUN yarn install

COPY packages/backend ./packages/backend
RUN yarn build

WORKDIR /app/packages/backend

ENTRYPOINT [ "yarn", "start" ]
