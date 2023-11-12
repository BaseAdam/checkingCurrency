import { CurrencyController } from "../controller/currency.controller";
import { Router } from "express";
import { ValidationMiddleware } from "../middleware/middleware";
import { validateCurrency } from "../repository/currency.repository";

export class Routes {
  private readonly currencyController: CurrencyController;
  private readonly validationMiddleware: ValidationMiddleware;

  constructor(currencyController: CurrencyController, validationMiddleware: ValidationMiddleware) {
    this.currencyController = currencyController;
    this.validationMiddleware = validationMiddleware;
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
