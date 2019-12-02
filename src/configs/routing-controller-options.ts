import * as jwt from 'jsonwebtoken';
import { Action } from 'routing-controllers';
import { getCustomRepository } from 'typeorm';
import { UserRepository } from '../repositories/userRepository';
import config from './config';

const srcDir = __dirname.replace('\\configs', '');

export const routingControllersOptions = {
  routePrefix: '/api',
  controllers: [`${srcDir}/controllers/**/*.ts`],
  middlewares: [`${srcDir}/middlewares/**/*.ts`],
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
