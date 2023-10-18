import { CurrencyController } from "../controller/currency.controller";
import { Router } from "express";
import { ValidationMiddleware } from "../middleware/middleware";
import { validateCurrency } from "../repository/currency.repository";

export class Routes {
  private readonly currencyController: CurrencyController;
  private readonly validationMiddleware: ValidationMiddleware;

  constructor() {
    this.currencyController = new CurrencyController();
    this.validationMiddleware = new ValidationMiddleware();
  }
  public registerRoutes(): Router {
    const router = Router();
    router.get(
      "/currency/:currency",
      (req, res, next) => this.validationMiddleware.getMiddleware(validateCurrency)(req, res, next),
      (req, res) => {
        this.currencyController.getCurrencyComparison(req, res);
      }
    );

    return router;
  }
}
