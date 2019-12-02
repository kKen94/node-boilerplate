import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import * as helmet from 'helmet';
import * as morgan from 'morgan';
import * as path from 'path';
import { createStream } from 'rotating-file-stream';
import { ExpressMiddlewareInterface, Middleware } from 'routing-controllers';

@Middleware({ type: 'before' })
export class HelmetMiddleware implements ExpressMiddlewareInterface {
  public use(request: any, response: any, next?: (err?: any) => any): any {
    return helmet()(request, response, next);
  }
}

// const corsOptions = {
//   origin: 'http://example.com',
//   optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
// };
// tslint:disable-next-line:max-classes-per-file
@Middleware({ type: 'before' })
export class CorsMiddleware implements ExpressMiddlewareInterface {
  public use(request: any, response: any, next?: (err?: any) => any): any {
    return cors()(request, response, next);
    // return cors(corsOptions)(request, response, next);
  }
}

// tslint:disable-next-line:max-classes-per-file
@Middleware({ type: 'before' })
export class BodyParserMiddleware implements ExpressMiddlewareInterface {
  public use(request: any, response: any, next?: (err?: any) => any): any {
    return bodyParser.json()(request, response, next);
  }
}

// tslint:disable-next-line:max-classes-per-file
@Middleware({ type: 'after' })
export class MorganMiddleware implements ExpressMiddlewareInterface {
  public use(request: any, response: any, next?: (err?: any) => any): any {
    const srcDir = __dirname.replace('\\middlewares', '');
    const accessLogStream = createStream('access.log', {
      interval: '1d', // rotate daily
      path: path.join(srcDir, 'log'),
    });
    return morgan('combined', { stream: accessLogStream })(
      request,
      response,
      next,
    );
  }
}
