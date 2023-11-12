import { Router } from 'express';
import { CurrencyController } from '../controller/currency.controller';

export class Routes {
  constructor(private readonly currencyController: CurrencyController) {}

  public registerCurrencyRoutes(): Router {
    const router = Router();

    router.get('/currency', (req, res) =>
      this.currencyController.getAllCurrencies(req, res)
    );

    return router;
  }
}
