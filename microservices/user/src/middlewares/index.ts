import { CustomErrorHandler } from './error';
import {
  BodyParserMiddleware,
  CorsMiddleware,
  HelmetMiddleware,
  LogMiddleware,
  MorganMiddleware,
} from './external';

export { CustomErrorHandler } from './error';
export {
  BodyParserMiddleware,
  CorsMiddleware,
  HelmetMiddleware,
  LogMiddleware,
  MorganMiddleware,
} from './external';

export const MIDDLEWARES = [
  CustomErrorHandler,
  BodyParserMiddleware,
  CorsMiddleware,
  HelmetMiddleware,
  LogMiddleware,
  MorganMiddleware,
];
