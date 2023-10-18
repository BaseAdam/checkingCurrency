import { NextFunction, Request, Response } from "express";

export class ValidationMiddleware {
  public getMiddleware<T>(validate: (currency: string | undefined, currencyToCompare: string | undefined) => T) {
    return (req: Request, res: Response, next: NextFunction): void => {
      try {
        if (typeof req.query.compare_to !== "string") return;
        validate(req.params.currency, req.query.compare_to);
      } catch (error) {
        res.status(400).send(error.message);
        return;
      }

      next();
    };
  }
}
