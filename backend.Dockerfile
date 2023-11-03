FROM oven/bun:1.0.7

COPY package.json bun.lockb lerna.json /app/
COPY packages/backend /app/packages/backend

WORKDIR /app
RUN bun install

WORKDIR /app/packages/backend
RUN chmod +x entrypoint.sh

ENTRYPOINT ["./entrypoint.sh"]
