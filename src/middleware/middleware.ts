import { NextFunction, Request, Response } from 'express';

export type ValidationMiddlewareFunc = (data: { body: unknown; params: unknown; headers: unknown }) => void;
export class ValidationMiddleware {
  public getMiddleware(validate: ValidationMiddlewareFunc) {
    return (req: Request, res: Response, next: NextFunction): void | Error => {
      try {
        validate({
          body: req.body,
          params: req.params,
          headers: req.headers,
        });
      } catch (error) {
        res.status(400).send(error.message);
        return;
      }

      next();
    };
  }
}
