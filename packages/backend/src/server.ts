import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { json } from 'body-parser';
import cors from 'cors';
import express, { Express } from 'express';
import { readFileSync } from 'fs';
import depthLimit from 'graphql-depth-limit';
import http from 'http';
import path from 'path';
import { AppDataSource } from './data-source';
import { loggerMiddleware } from './middlewares/logger';
import resolvers from './resolvers';
import { context, Context } from './resolvers/context';
import { formatError } from './utils/error';
import { fatalLogger, launchLogger } from './utils/logger';

const typeDefs = readFileSync(path.join(__dirname, 'schema.gql'), 'utf8');

async function createApp(): Promise<Express> {
  const app = express();
  const httpServer = http.createServer(app);
  const server = new ApolloServer<Context>({
    typeDefs,
    resolvers,
    includeStacktraceInErrorResponses: process.env.NODE_ENV === 'development',
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      ApolloServerPluginLandingPageLocalDefault(),
    ],
    formatError,
    validationRules: [depthLimit(6)],
  });

  launchLogger('DB connecting...');
  await AppDataSource.initialize()
    .then(async () => launchLogger('datasource is initialized!'))
    .catch((error) => fatalLogger(error));
  launchLogger('DB connected');

  await server.start();

  app.use(loggerMiddleware());
  app.use(
    '/graphql',
    cors<cors.CorsRequest>(),
    json(),
    expressMiddleware(server, {
      context: async ({ req, res }) => context(req, res),
    }),
  );

  return app;
}

let appCache: Express;

export async function server(): Promise<Express> {
  if (appCache) {
    return appCache;
  }

  launchLogger('Creating app ...');
  const app = await createApp();
  launchLogger('Created app!!!');
  appCache = app;

  return app;
}
