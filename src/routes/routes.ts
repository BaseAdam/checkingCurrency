import { inject, injectable } from 'inversify';
import { CurrencyController } from '../controller/currency.controller';
import { Router } from 'express';
import 'reflect-metadata';
import { ValidationMiddlewareFactory } from '../middleware/middleware';
import { validateCurrency, validateCurrencyInQueryIfExists } from '../utils/validateCurrencies';

@injectable()
export class Routes {
  constructor(
    @inject(CurrencyController) private readonly currencyController: CurrencyController,
    @inject(ValidationMiddlewareFactory) private readonly validationMiddlewareFactory: ValidationMiddlewareFactory,
  ) {}

  public registerRoutes(): Router {
    const router = Router();

    router.get('/currency', (req, res) => this.currencyController.getAllCurrencies(req, res));
    router.get(
      '/currency/:currency',
      (req, res, next) => {
        try {
          this.validationMiddlewareFactory.getMiddleware(validateCurrency)(req, res, next);
        } catch (error) {
          next(error);
        }
      },
      (req, res, next) => {
        try {
          this.validationMiddlewareFactory.getMiddleware(validateCurrencyInQueryIfExists)(req, res, next);
        } catch (error) {
          next(error);
        }
      },
      (req, res) => {
        if (req.query.compare_to) {
          this.currencyController.getCurrencyComparison(req, res);
        } else {
          this.currencyController.getCurrencyChangeRate(req, res);
        }
      },
    );
    return router;
  }
}
