import { CurrencyController } from "../controller/currency.controller";
import express from 'express';

export const router = express.Router()
export class Routes {
    private readonly currencyController: CurrencyController

    constructor() {
        this.currencyController = new CurrencyController()
    }
    public registerRoutes() {
        router.get("/currency/:currency?compare_to=currencyToCompare", (req, res) => 
            this.currencyController.getCurrencyComparison(req, res));
    }
}