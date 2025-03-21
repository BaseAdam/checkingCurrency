import { NextFunction, Request, Response } from 'express';
import { IncomingHttpHeaders } from 'http';
import { injectable } from 'inversify';
import 'reflect-metadata';
import { z } from 'zod';

export enum Currency {
  USD = 'USD',
  PLN = 'PLN',
  EUR = 'EUR',
  GBP = 'GBP',
  CHF = 'CHF',
}

export type ValidationMiddlewareFunc = (data: {
  body: unknown;
  params: Record<string, unknown>;
  headers: IncomingHttpHeaders;
  query: Record<string, unknown>;
}) => void;

export const currencySchema = z.nativeEnum(Currency);
@injectable()
export class ValidationMiddlewareFactory {
  public getMiddleware(validate: ValidationMiddlewareFunc) {
    return (req: Request, res: Response, next: NextFunction): void | Error => {
      try {
        validate({
          body: req.body,
          params: req.params,
          headers: req.headers,
          query: req.query,
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

export const validateCurrencyInQueryIfExists: ValidationMiddlewareFunc = ({ query }): void => {
  if (query.compare_to) {
    try {
      currencySchema.parse(query.compare_to);
    } catch (e) {
      throw new Error('Currency not found');
    }
  }
};

export const validateCurrency: ValidationMiddlewareFunc = ({ params }): void => {
  try {
    currencySchema.parse(params.currency);
  } catch (e) {
    throw new Error('Currency not found');
  }
};
