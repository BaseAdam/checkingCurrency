import { inject, injectable } from 'inversify';
import { CurrencyController } from '../controller/currency.controller';
import { ValidationMiddlewareFactory } from '../middleware/middleware';
import { validateCurrency, validateCurrencyInQueryIfExists } from '../repository/currency.repository';
import { Router } from 'express';
import 'reflect-metadata';

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
      (req, res, next) => this.validationMiddlewareFactory.getMiddleware(validateCurrency)(req, res, next),
      (req, res, next) => this.validationMiddlewareFactory.getMiddleware(validateCurrencyInQueryIfExists)(req, res, next),
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
