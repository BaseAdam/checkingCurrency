import { readFileSync } from 'fs';
import { Config } from '../config/config';
import { ValidationMiddlewareFunc } from '../middleware/middleware';

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
export type ExchangeRate = { currency: Currency; exchangeRate: number };

export const validateCurrency: ValidationMiddlewareFunc = (currency) => {
  if (currency.params) {
    const params = Object.values(currency.params)[0];
    if (isNaN(params)) {
      if (Object.keys(Currency).find((key) => key === params)) {
        return;
      } else {
        throw new Error('Currency not found');
      }
    }
    throw new Error('Provide a currency not a number');
  }
  throw new Error('Error');
};

export class CurrencyRepository {
  private readonly currencies: Currencies;

  constructor(private readonly config: Config) {
    this.currencies = JSON.parse(readFileSync(this.config.getCurrenciesPath(), 'utf-8')).currencies;
  }

  public async getAllCurrencies(): Promise<Currency[]> {
    return Object.values(Currency);
  }

  public async getCurrencyChangeRate(currency: string): Promise<ExchangeRate[]> {
    const entries = Object.entries(this.currencies).find((key) => key[0] === currency)?.[1];
    if (entries) {
      const exchangeRate = Object.entries(entries).map(([currency, exchangeRate]) => ({ currency, exchangeRate }));
      return Object.assign({ exchangeRate });
    } else {
      const exchangeRate: ExchangeRate[] = [];
      return Object.assign({ exchangeRate });
    }
  }
}
