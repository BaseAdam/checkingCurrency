import { Router } from 'express';
import { CurrencyController } from '../controller/currency.controller';
import { CurrencyService } from '../service/currency.service';
import { CurrencyRepository } from '../repository/currency.repository';

export class Routes {
  private readonly currencyController: CurrencyController;
  private readonly currencyService: CurrencyService;
  private readonly currencyRepository: CurrencyRepository;

  constructor() {
    this.currencyRepository = new CurrencyRepository();
    this.currencyService = new CurrencyService(this.currencyRepository);
    this.currencyController = new CurrencyController(this.currencyService);
  }

  public registerCurrencyRoutes(): Router {
    const router = Router();

    router.get('/currency', (req, res) =>
      this.currencyController.getAllCurrencies(req, res)
    );

    return router;
  }
}
