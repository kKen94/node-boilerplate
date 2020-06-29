import * as cors from '@koa/cors';
import * as bodyParser from 'koa-bodyparser';
import * as helmet from 'koa-helmet';
import * as logger from 'koa-logger';
import * as morgan from 'koa-morgan';
import * as path from 'path';
import { createStream } from 'rotating-file-stream';
import { KoaMiddlewareInterface, Middleware } from 'routing-controllers';

@Middleware({ type: 'before' })
export class HelmetMiddleware implements KoaMiddlewareInterface {
  public use(context: any, next: (err?: any) => Promise<any>): Promise<any> {
    return helmet()(context, next);
  }
}

// const corsOptions = {
//   origin: 'http://example.com',
//   optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
// };
// tslint:disable-next-line:max-classes-per-file
@Middleware({ type: 'before' })
export class CorsMiddleware implements KoaMiddlewareInterface {
  public use(context: any, next: (err?: any) => Promise<any>): Promise<any> {
    return cors()(context, next);
  }
}

// tslint:disable-next-line:max-classes-per-file
@Middleware({ type: 'before' })
export class LogMiddleware implements KoaMiddlewareInterface {
  public use(context: any, next: (err?: any) => Promise<any>): Promise<any> {
    return logger()(context, next);
  }
}

// tslint:disable-next-line:max-classes-per-file
@Middleware({ type: 'before' })
export class BodyParserMiddleware implements KoaMiddlewareInterface {
  public use(context: any, next: (err?: any) => Promise<any>): Promise<any> {
    return bodyParser()(context, next);
  }
}

// tslint:disable-next-line:max-classes-per-file
@Middleware({ type: 'after' })
export class MorganMiddleware implements KoaMiddlewareInterface {
  public use(context: any, next: (err?: any) => Promise<any>): Promise<any> {
    const srcDir = __dirname.replace('\\middlewares', '');
    const accessLogStream = createStream('access.log', {
      interval: '1d', // rotate daily
      path: path.join(srcDir, 'log'),
    });
    return morgan('combined', { stream: accessLogStream })(context, next);
  }
}
