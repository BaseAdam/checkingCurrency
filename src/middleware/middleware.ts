import { NextFunction, Request, Response } from 'express';
import { IncomingHttpHeaders } from 'http';

export type ValidationMiddlewareFunc = (data: { body: unknown; params: Record<string, unknown>; headers: IncomingHttpHeaders }) => void;

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
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        res.status(400).send(errorMessage);
        return;
      }

      next();
    };
  }
}
