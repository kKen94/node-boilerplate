import { getFromContainer, MetadataStorage } from 'class-validator';
import { validationMetadatasToSchemas } from 'class-validator-jsonschema';
import * as jwt from 'jsonwebtoken';
import 'reflect-metadata';
import {
  Action,
  createExpressServer,
  getMetadataArgsStorage,
} from 'routing-controllers';
import { routingControllersToSpec } from 'routing-controllers-openapi';
import * as swStats from 'swagger-stats';
import * as swaggerUI from 'swagger-ui-express';
import { createConnection, getCustomRepository } from 'typeorm';
import config from './configs/config';
import { UserRepository } from './repositories/userRepository';

const routingControllersOptions = {
  routePrefix: '/api',
  controllers: [`${__dirname}/controllers/**/*.ts`],
  middlewares: [`${__dirname}/middlewares/**/*.ts`],
  defaults: {
    nullResultCode: 404,
    undefinedResultCode: 204,
    paramOptions: {
      required: true,
    },
  },
  authorizationChecker: async (action: Action, roles: string[]) => {
    const token = action.request.headers['authorization'];

    try {
      jwt.verify(token, config.jwtSecret);
    } catch (e) {
      return false;
    }

    if (roles.length) {
      const userRepository = getCustomRepository(UserRepository);
      const user = await userRepository.findOneByToken(token);
      return roles.includes(user.role);
    }
  },
  currentUserChecker: async (action: Action) => {
    const token = action.request.headers['authorization'];
    const userRepository = getCustomRepository(UserRepository);
    return await userRepository.findOneByToken(token);
  },
};

createConnection()
  .then(async connection => {
    const app = createExpressServer(routingControllersOptions);

    // Parse class-validator classes into JSON Schema:
    const metadatas = (getFromContainer(MetadataStorage) as any)
      .validationMetadatas;
    const schemas = validationMetadatasToSchemas(metadatas, {
      refPointerPrefix: '#/components/schemas/',
    });

    // Parse routing-controllers classes into OpenAPI spec:
    const storage = getMetadataArgsStorage();
    const spec = routingControllersToSpec(
      storage as any,
      routingControllersOptions,
      {
        components: {
          schemas,
          securitySchemes: {
            basicAuth: {
              scheme: 'basic',
              type: 'http',
            },
          },
        },
        info: {
          description: 'Generated with `routing-controllers-openapi`',
          title: 'A sample API',
          version: '1.0.0',
        },
      },
    );

    app.use('/swagger', swaggerUI.serve, swaggerUI.setup(spec));
    app.use(
      swStats.getMiddleware({ swaggerSpec: spec, name: 'swagger-stats-test' }),
    );

    app.listen(3001, () => {
      console.log('Server started on port 3001 😎');
    });
  })
  .catch(error => console.log(error));
