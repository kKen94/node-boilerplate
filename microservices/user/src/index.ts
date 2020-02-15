import { jwtEagle } from '@config';
import { getRepo } from '@helper';
import { UserRepository } from '@repository';
import { getFromContainer, MetadataStorage } from 'class-validator';
import { validationMetadatasToSchemas } from 'class-validator-jsonschema';
import * as e2k from 'express-to-koa';
import * as jwt from 'jsonwebtoken';
import * as koaSwagger from 'koa2-swagger-ui';
import 'reflect-metadata';
import { Action, createKoaServer, getMetadataArgsStorage } from 'routing-controllers';
import { routingControllersToSpec } from 'routing-controllers-openapi';
import * as swStats from 'swagger-stats';
import { createConnection } from 'typeorm';
import { seed } from './seeds/seed';

const routingControllersOptions = {
  // routePrefix: '/api',
  controllers: [`${__dirname}/controllers/**/*.ts`],
  middlewares: [`${__dirname}/middlewares/**/*.ts`],
  defaults: {
    nullResultCode: 404,
    undefinedResultCode: 204,
    paramOptions: {
      required: true,
    },
  },
  authorizationChecker: async (action: Action, requestPermissions: string[]) => {
    const token = action.request.headers['authorization'];
    let decoded;
    try {
      decoded = jwt.verify(token, jwtEagle.secret);
    } catch (e) {
      return false;
    }

    if (requestPermissions.length) {
      const userRepository = getRepo(UserRepository);
      const user = await userRepository.userByIdWithPermissions(decoded['id']);
      return requestPermissions.every(requestPermission =>
        user.permissions.map(permission => permission.name).includes(requestPermission),
      );
    }
  },
  currentUserChecker: async (action: Action) => {
    const token = action.request.headers['authorization'];
    const decoded = jwt.decode(token);
    const userRepository = getRepo(UserRepository);
    return await userRepository.getById(decoded['id']);
  },
};

createConnection(process.env.NODE_ENV)
  .then(async connection => {
    const app = createKoaServer(routingControllersOptions);

    // Parse class-validator classes into JSON Schema:
    const metadatas = (getFromContainer(MetadataStorage) as any).validationMetadatas;
    const schemas = validationMetadatasToSchemas(metadatas, {
      refPointerPrefix: '#/components/schemas/',
    });

    // Parse routing-controllers classes into OpenAPI spec:
    const storage = getMetadataArgsStorage();
    const spec = routingControllersToSpec(storage as any, routingControllersOptions, {
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
    });
    app.use(koaSwagger({ routePrefix: '/swagger', swaggerOptions: { spec } }));
    app.use(e2k(swStats.getMiddleware({ swaggerSpec: spec })));

    app.listen(3001, async () => {
      await seed(connection);
      console.log('Server started on port 3001 😎');
    });
  })
  .catch(error => {
    console.log(error);
  });
