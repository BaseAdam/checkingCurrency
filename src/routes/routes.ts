import { Router } from 'express';
import { CurrencyController } from '../controller/currency.controller';

export const router = Router()

export class Routes {
    private readonly currencyController: CurrencyController;

    constructor() {
        this.currencyController = new CurrencyController();
        router.get("/", (req, res) => 
            this.currencyController.getRandom(req, res));
    }
    
}