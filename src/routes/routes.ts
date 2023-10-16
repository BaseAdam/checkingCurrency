import { CurrencyController } from "../controller/currency.controller";
import { Router } from "express";

export class Routes {
  private readonly currencyController: CurrencyController;

  constructor() {
    this.currencyController = new CurrencyController();
  }
  public registerRoutes(): Router {
    const router = Router();
    router.get("/currency/:currency", (req, res) => this.currencyController.getCurrencyComparison(req, res));

    return router;
  }
}
