import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import express, { Express } from 'express';
import http from 'http';
import cors from 'cors';
import { json } from 'body-parser';
import path from 'path';
import { readFileSync } from 'fs';
import resolvers from './resolvers';
import { AppDataSource } from './data-source';
import { context, Context } from './resolvers/context';

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
  });

  await AppDataSource.initialize()
    .then(async () => console.log(`datasource is initialized!`))
    .catch((error) => console.log(error));

  await server.start();

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

  console.log('Creating app ...');
  const app = await createApp();
  console.log('Created app!!!');
  appCache = app;

  return app;
}
