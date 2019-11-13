import * as bodyParser from 'body-parser';
import { getFromContainer, MetadataStorage } from 'class-validator';
import { validationMetadatasToSchemas } from 'class-validator-jsonschema';
import * as cors from 'cors';
import * as helmet from 'helmet';
import * as jwt from 'jsonwebtoken';
import * as morgan from 'morgan';
import * as path from 'path';
import 'reflect-metadata';
import rotatingFileStream from 'rotating-file-stream';
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

const corsOptions = {
  origin: 'http://example.com',
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};

const routingControllersOptions = {
  routePrefix: '/api',
  controllers: [`${__dirname}/controllers/**/*.ts`],
  // middlewares: [__dirname + "/middlewares/**/*.ts"],
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
    // Create express app
    const app = createExpressServer(routingControllersOptions);

    const accessLogStream = rotatingFileStream('access.log', {
      interval: '1d', // rotate daily
      path: path.join(__dirname, 'log'),
    });
    // Setup the logger
    app.use(morgan('combined', { stream: accessLogStream }));

    // Call middlewares
    app.use(cors());
    // app.use(cors(corsOptions));

    app.use(helmet());

    app.use(bodyParser.json());

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
