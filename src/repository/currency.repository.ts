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
export type ComparisonRate = { exchangeRate: number };

const isCurrency = (currency: unknown): currency is Currency => {
  if (!currency) {
    return false;
  }

  if (typeof currency !== 'string') {
    return false;
  }

  if (!Object.values(Currency).includes(currency as Currency)) {
    return false;
  }

  return true;
};

export const validateCurrency: ValidationMiddlewareFunc = ({ params }) => {
  const currency = params.currency;

  if (!isCurrency(currency)) {
    throw new Error('Currency not found');
  }
};

export const validateCurrencyInQueryIfExists: ValidationMiddlewareFunc = ({ query }) => {
  const currency = query.compare_to;

  if (currency && !isCurrency(currency)) {
    throw new Error('Currency not found');
  }
};

export class CurrencyRepository {
  private readonly currencies: Currencies['currencies'];

  constructor(private readonly config: Config) {
    this.currencies = JSON.parse(readFileSync(this.config.getCurrenciesPath(), 'utf-8')).currencies;
  }

  public async getAllCurrencies(): Promise<Currency[]> {
    return Object.values(Currency);
  }

  public async getCurrencyChangeRate(currency: Currency): Promise<ExchangeRate[]> {
    const exchangeRates = this.currencies[currency];
    if (!exchangeRates) {
      throw new Error('Currency not found');
    }

    return Object.entries(exchangeRates).map(([key, value]) => ({ currency: key as Currency, exchangeRate: value }));
  }

  public async getCurrencyComparison(currency: Currency, currencyToCompare: Currency): Promise<ComparisonRate> {
    const allExchangeRates = this.currencies[currency];
    const chosenCurrencyExchangeRate = allExchangeRates[currencyToCompare];
    return { exchangeRate: chosenCurrencyExchangeRate };
  }
}
