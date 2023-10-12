import express from 'express';
import { CurrencyController } from '../controller/currency.controller';

export const router = express.Router()

export class Routes {
    private readonly currencyController: CurrencyController;

    constructor() {
        this.currencyController = new CurrencyController();
    }
    public registerRoutes() {
        router.get("/random", (req, res) => 
            this.currencyController.getRandom(req, res));
    }
    
}