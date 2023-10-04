import { readFileSync } from 'fs';
import { join } from 'path';

export enum Currency {
  USD = 'USD',
  PLN = 'PLN',
  EUR = 'EUR',
  GBP = 'GBP',
  CHF = 'CHF',
}

export type Currencies = {
  currencies: {
    [outerKey in Currency]: Record<Currency, number>;
  };
};

export class CurrencyRepository {
  private readonly currencies: Currencies;

  constructor() {
    this.currencies = JSON.parse(
      readFileSync(
        join(__filename, '..', '..', 'config', 'currencies.json'),
        'utf-8'
      )
    ).currencies;
  }

  public async getAllCurrencies(): Promise<Currency[]> {
    return Object.values(Currency);
  }
}
