import { Request, Response } from 'express';
import { CurrencyService } from '../service/currency.service';

export class CurrencyController {
  private readonly currencyService: CurrencyService;

  constructor() {
    this.currencyService = new CurrencyService();
  }

  public async getAllCurrencies(req: Request, res: Response): Promise<void> {
    const currencies = await this.currencyService.getAllCurrencies();
    res.send(currencies);
  }
}
