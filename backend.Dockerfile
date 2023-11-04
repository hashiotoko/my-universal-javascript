FROM node:18.17.0-bullseye-slim

COPY package.json yarn.lock lerna.json /app/
COPY packages/backend /app/packages/backend

WORKDIR /app
RUN yarn install && yarn build

WORKDIR /app/packages/backend
RUN chmod +x entrypoint.sh

ENTRYPOINT ["./entrypoint.sh"]
