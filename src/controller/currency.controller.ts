import { Request, Response } from 'express';
import { CurrencyService } from '../service/currency.service';
import { Currency } from '../repository/currency.repository';

export class CurrencyController {
  private readonly currencyService: CurrencyService;

  constructor(currencyService: CurrencyService) {
    this.currencyService = currencyService;
  }

  public async getAllCurrencies(req: Request, res: Response): Promise<void> {
    const currencies = await this.currencyService.getAllCurrencies();
    res.send(currencies);
  }

  public async getCurrencyChangeRate(req: Request, res: Response): Promise<void> {
    const currency = req.params.currency as Currency;
    const currencyChangeRate = await this.currencyService.getCurrencyChangeRate(currency);
    res.send({ exchangeRates: currencyChangeRate });
  }
}
