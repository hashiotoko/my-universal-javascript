import { server } from './server';
import { fatalLogger, launchLogger } from './utils/logger';

const PORT = process.env.PORT || 4000;
server()
  .then((app) => app.listen(PORT))
  .then(() =>
    launchLogger(`🚀 Server ready at http://localhost:${PORT}/graphql`),
  )
  .catch(async (e) => {
    fatalLogger(e);
    process.exit(1);
  });
