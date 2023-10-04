import { Router } from 'express';
import { CurrencyController } from '../controller/currency.controller';

export class Routes {
  private readonly currencyController: CurrencyController;

  constructor() {
    this.currencyController = new CurrencyController();
  }

  public registerCurrencyRoutes(): Router {
    const router = Router();

    router.get('/currency', (req, res) =>
      this.currencyController.getAllCurrencies(req, res)
    );

    return router;
  }
}
