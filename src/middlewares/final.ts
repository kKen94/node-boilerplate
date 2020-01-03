import { Request, Response } from 'express';
import { ExpressMiddlewareInterface, Middleware } from 'routing-controllers';

@Middleware({ type: 'after' })
export class FinalMiddleware implements ExpressMiddlewareInterface {
  public use(
    request: Request,
    response: Response,
    next?: (err?: any) => any,
  ): any {
    if (response.headersSent || response.finished) {
      response.end();
    } else {
      next();
    }
  }
}
