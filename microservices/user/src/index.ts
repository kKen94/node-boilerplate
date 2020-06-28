import { jwtEagle } from '@config';
import { cleanToken, getRepo, verifySmtpAsync } from '@helper';
import { UserRepository } from '@repository';
import { validationMetadatasToSchemas } from 'class-validator-jsonschema';
import * as e2k from 'express-to-koa';
import * as jwt from 'jsonwebtoken';
import * as koaSwagger from 'koa2-swagger-ui';
import 'reflect-metadata';
import {
  Action,
  createKoaServer,
  getMetadataArgsStorage,
} from 'routing-controllers';
import { routingControllersToSpec } from 'routing-controllers-openapi';
import * as swStats from 'swagger-stats';
import { createConnection } from 'typeorm';
import { seed } from './seeds/seed';
import { CONTROLLERS } from '@controllers';
import { MIDDLEWARES } from '@middlewares';
import { CONNECTIONS } from './connection';

const routingControllersOptions = {
  // routePrefix: '/api',
  controllers: CONTROLLERS,
  middlewares: MIDDLEWARES,
  defaults: {
    nullResultCode: 404,
    undefinedResultCode: 204,
    paramOptions: {
      required: true,
    },
  },
  authorizationChecker: async (
    action: Action,
    requestPermissions: string[],
  ) => {
    /* TODO:
     * se ogni volta queryo l'utente da db e faccio le verifiche
     * se è abilitato, se è eliminato fisicamente o logicamente, se è attivo...
     * è più sicuro (e dispendioso)
     */
    const token: string = action.request.headers['authorization'];
    let decoded;
    try {
      decoded = jwt.verify(cleanToken(token), jwtEagle.secret);
    } catch (e) {
      return false;
    }

    if (requestPermissions.length) {
      /* TODO:
       * se ogni volta queryo i permessi dell'utente da db è più sicuro (e dispendioso)
       */
      const tokenPermissions: string[] = decoded['permissions'];
      return requestPermissions.every(requestPermission =>
        tokenPermissions
          .map(permission => permission)
          .includes(requestPermission),
      );
    }
  },
  currentUserChecker: async (action: Action) => {
    const token = action.request.headers['authorization'];
    const decoded = jwt.decode(cleanToken(token));
    const userRepository = getRepo(UserRepository);
    return await userRepository.findById(decoded['userId']);
  },
};

const connectionOpt = CONNECTIONS.find(c => c.name === process.env.NODE_ENV) ?? CONNECTIONS.find(c => c.name === 'default');

createConnection(connectionOpt)
  .then(async connection => {
    const app = createKoaServer(routingControllersOptions);

    const schemas = validationMetadatasToSchemas({
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
    // @ts-ignore
    // app.use(koaSwagger({ routePrefix: '/swagger', swaggerOptions: { spec } }));
    // app.use(e2k(swStats.getMiddleware({ swaggerSpec: spec })));
    // TODO: capire come compilare koa-swagger

    app.listen(3001, async () => {
      await verifySmtpAsync();
      await seed(connection);
      console.log('Server started on port 3001 😎');
    });
  })
  .catch(error => {
    console.log(error);
  });
