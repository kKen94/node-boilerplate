import 'reflect-metadata';
import { createExpressServer } from 'routing-controllers';
import * as swStats from 'swagger-stats';
import * as swaggerUI from 'swagger-ui-express';
import { createConnection } from 'typeorm';
import { routingControllersOptions } from './configs/routing-controller-options';
import { spec } from './configs/swagger-specs';

createConnection()
  .then(async connection => {
    const app = createExpressServer(routingControllersOptions);

    app.use('/swagger', swaggerUI.serve, swaggerUI.setup(spec));
    app.use(
      swStats.getMiddleware({ swaggerSpec: spec, name: 'swagger-stats-test' }),
    );

    app.listen(3001, () => {
      console.log('Server started on port 3001 😎');
    });
  })
  .catch(error => console.log(error));
