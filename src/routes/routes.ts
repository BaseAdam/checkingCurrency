import { CurrencyController } from '../controller/currency.controller';
import { ValidationMiddleware } from '../middleware/middleware';
import { validateCurrency } from '../repository/currency.repository';
import { Router } from 'express';

export class Routes {
  constructor(
    private readonly currencyController: CurrencyController,
    private readonly validationMiddleware: ValidationMiddleware,
  ) {}

  public registerRoutes(): Router {
    const router = Router();

    router.get('/currency', (req, res) => this.currencyController.getAllCurrencies(req, res));
    router.get(
      '/currency/:currency',
      (req, res, next) => this.validationMiddleware.getMiddleware(validateCurrency)(req, res, next),
      (req, res) => {
        this.currencyController.getCurrencyChangeRate(req, res);
      },
    );

    return router;
  }
}
