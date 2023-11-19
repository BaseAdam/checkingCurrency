import { NextFunction, Request, Response } from 'express';

export class ValidationMiddleware {
  public getMiddleware<T>(validate: (currency: string | undefined) => T) {
    return (req: Request, res: Response, next: NextFunction): void | Error => {
      try {
        validate(req.params.currency);
      } catch (error) {
        res.status(400).send(error.message);
        return;
      }

      next();
    };
  }
}
