import { readFileSync } from 'fs';
import { join } from 'path';

export type Currency = {
  currencies: {
    USD: Object;
    PLN: Object;
    EUR: Object;
    GBP: Object;
    CHF: Object;
  };
};

export class CurrencyRepository {
  private readonly currencies: Currency;

  constructor() {
    this.currencies = JSON.parse(
      readFileSync(
        join(__filename, '..', '..', 'config', 'currencies.json'),
        'utf-8'
      )
    ).currencies;
  }

  public async getAllCurrencies(): Promise<Currency> {
    return this.currencies;
  }
}
