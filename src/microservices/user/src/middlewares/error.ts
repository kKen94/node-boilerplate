import { KoaMiddlewareInterface, Middleware } from 'routing-controllers';

@Middleware({ type: 'before' })
export class CustomErrorHandler implements KoaMiddlewareInterface {
  // interface implementation is optional
  public use(context: any, next: (err?: any) => Promise<any>): Promise<any> {
    return next().catch(error => {
      console.log(error);
    });
  }
}
