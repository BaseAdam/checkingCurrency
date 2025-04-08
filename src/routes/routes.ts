import { inject, injectable } from 'inversify';
import { CurrencyController } from '../controller/currency.controller';
import { validateCurrency, validateCurrencyInQueryIfExists, ValidationMiddlewareFactory } from '../middleware/middleware';
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
    /**
     * @openapi
     * /api/currency:
     *   get:
     *     description: Get all currencies
     *     responses:
     *       200:
     *         description: Returns a list of all currencies as an array
     *         content:
     *           application/json:
     *             example:
     *                 - "EUR"
     *                 - "GBP"
     */
    router.get('/currency', (req, res) => this.currencyController.getAllCurrencies(req, res));
    /**
     * @openapi
     * /api/currency/{currency}:
     *   get:
     *     description: Get exchange rate pair for specific currencies
     *     parameters:
     *       - in: path
     *         name: currency
     *         required: true
     *         schema:
     *           type: string
     *         example: USD
     *         description: The base currency code (e.g., USD)
     *       - in: query
     *         name: compare_to
     *         required: false
     *         schema:
     *           type: string
     *         example: EUR
     *         description: The currency to compare against (e.g., EUR)
     *     responses:
     *       200:
     *         description: Exchange rate pair for the given currencies
     *         content:
     *           application/json:
     *             examples:
     *               withCompareTo:
     *                 summary: Without `compare_to` query parameter
     *                 value:
     *                   exchangeRates:
     *                     - currency: "EUR"
     *                       exchangeRate: 0.91
     *                     - currency: "GBP"
     *                       exchangeRate: 0.23
     *               withoutCompareTo:
     *                 summary: With `compare_to` query parameter
     *                 value:
     *                     exchangeRate: 1.20
     */
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
