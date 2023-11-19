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
export type ExchangeRate = [
  baseCurrency: string,
  rates: {
    [exchangeCurrencyName: string]: Record<Currency, number>;
  },
];

export const validateCurrency = (currency: string | undefined): string | undefined => {
  if (Object.keys(Currency).find((key) => key === currency)) {
    return currency;
  } else {
    throw new Error('Currency not found');
  }
};
export class CurrencyRepository {
  private readonly currencies: Currencies;

  constructor(private readonly config: Config) {
    this.currencies = JSON.parse(readFileSync(this.config.getCurrenciesPath(), 'utf-8')).currencies;
  }

  public async getAllCurrencies(): Promise<Currency[]> {
    return Object.values(Currency);
  }

  public async getCurrencyChangeRate(currency: string): Promise<ExchangeRate | undefined> {
    const entries = Object.entries(this.currencies);
    return entries.find((key) => key[0] === currency);
  }
}
