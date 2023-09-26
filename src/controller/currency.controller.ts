import { Request, Response } from "express";
import { CurrencyService } from "../service/currency.service"

export class CurrencyController {
    private readonly currencyService: CurrencyService;

    constructor() {
        this.currencyService = new CurrencyService();
    }

    public async getCurrencyComparison(req: Request, res: Response): Promise<void> {
        const currency = String(req.params.currency)
        const currencyToCompare = String(req.query.compare_to)
        const currencyComparison = await this.currencyService.getCurrencyComparison(currency, currencyToCompare);
        res.send(currencyComparison)
    }
}