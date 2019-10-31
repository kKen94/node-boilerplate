import 'reflect-metadata';
import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import * as helmet from 'helmet';
import * as jwt from 'jsonwebtoken';
import { createConnection, getCustomRepository } from 'typeorm';
import { Action, createExpressServer } from 'routing-controllers';
import { UserRepository } from './repositories/userRepository';
import config from './configs/config';

const corsOptions = {
  origin: 'http://example.com',
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};

const routingControllersOptions = {
  routePrefix: '/api',
  controllers: [__dirname + '/controllers/**/*.ts'],
  // middlewares: [__dirname + "/middlewares/**/*.ts"],
  defaults: {
    nullResultCode: 404,
    undefinedResultCode: 204,
  },
  authorizationChecker: async (action: Action, roles: string[]) => {
    // here you can use request/response objects from action
    // also if decorator defines roles it needs to access the action
    // you can use them to provide granular access check
    // checker must return either boolean (true or false)
    // either promise that resolves a boolean value
    // demo code:
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
};

createConnection()
  .then(async connection => {
    // create express app
    const app = createExpressServer(routingControllersOptions);

    // Call middlewares
    app.use(cors());
    // app.use(cors(corsOptions));

    app.use(helmet());
    app.use(bodyParser.json());
    // Parse class-validator classes into JSON Schema:
    // const metadatas = (getFromContainer(MetadataStorage) as any).validationMetadatas;
    // const schemas = validationMetadatasToSchemas(metadatas, {
    //     refPointerPrefix: '#/components/schemas/'
    // });
    //
    // const spec = routingControllersToSpec(getMetadataArgsStorage(), routingControllersOptions, {
    //     components: {
    //         schemas,
    //         securitySchemes: {
    //             basicAuth: {
    //                 scheme: 'basic',
    //                 type: 'http'
    //             }
    //         }
    //     },
    //     info: {
    //         description: 'Generated with `routing-controllers-openapi`',
    //         title: 'A sample API',
    //         version: '1.0.0'
    //     }
    // });
    //
    // // Render spec on root:
    // app.get('/swagger', (_req, res) => {
    //     res.json(spec)
    // });

    app.listen(3001, () => {
      console.log('Server started on port 3001');
    });
  })
  .catch(error => console.log(error));
