import { Response } from 'express';
import {
  ExpressErrorMiddlewareInterface,
  Middleware,
} from 'routing-controllers';

@Middleware({ type: 'after' })
export class CustomErrorHandler implements ExpressErrorMiddlewareInterface {
  public error(
    error: any,
    request: any,
    response: Response,
    next: (err: any) => any,
  ) {
    // console.log(response.finished);
  }
}
