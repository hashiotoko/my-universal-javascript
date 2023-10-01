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

const typeDefs = readFileSync(
  path.join(__dirname, 'typeDefs.graphql'),
  'utf-8'
);

async function createApp(): Promise<Express> {
  const app = express();
  const httpServer = http.createServer(app);
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      ApolloServerPluginLandingPageLocalDefault(),
    ],
  });

  await server.start();

  app.use(
    '/graphql',
    cors<cors.CorsRequest>(),
    json(),
    expressMiddleware(server, {
      context: async ({ req }) => ({ token: req.headers.token }),
    })
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
