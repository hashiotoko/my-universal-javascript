import { server } from './server';

const PORT = process.env.PORT || 4000;
server()
  .then((app) => app.listen(PORT))
  .then(() =>
    console.log(`🚀 Server ready at http://localhost:${PORT}/graphql`)
  );
