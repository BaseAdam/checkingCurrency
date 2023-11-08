import { readFileSync } from 'fs';
import { Config } from '../config/config';

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

  constructor(private readonly config: Config) {
    this.currencies = JSON.parse(
      readFileSync(this.config.getCurrenciesPath(), 'utf-8')
    ).currencies;
  }

  public async getAllCurrencies(): Promise<Currency[]> {
    return Object.values(Currency);
  }
}
