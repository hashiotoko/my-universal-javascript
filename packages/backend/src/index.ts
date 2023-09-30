import cors from 'cors';
import express from 'express';
import { graphqlHTTP } from 'express-graphql';
import { GraphQLSchema } from 'graphql';
import { queryType, mutationType } from './fields/';

const PORT = 4000;
const app = express();

const schema = new GraphQLSchema({
  query: queryType,
  mutation: mutationType,
});

app.use(cors());
app.use(
  '/graphql',
  express.json(),
  graphqlHTTP({
    schema,
    graphiql: true,
  })
);

app.listen(PORT, () => console.log('Listening on :4000'));
