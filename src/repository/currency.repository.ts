import { ValidationMiddlewareFunc } from '../middleware/middleware';
import { Collection } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

export enum Currency {
  USD = 'USD',
  PLN = 'PLN',
  EUR = 'EUR',
  GBP = 'GBP',
  CHF = 'CHF',
}

export type ExchangeRate = { currency: Currency; exchangeRate: number };
export type ComparisonRate = { exchangeRate: number };
export type CurrencyEntity = { name: string; rates: Record<string, number> };

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
  constructor(private readonly collection: Collection<CurrencyEntity>) {}

  public async getAllCurrencies(): Promise<string[]> {
    const currencies = await this.collection.find().toArray();
    if (currencies.length === 0) {
      throw new Error('Currencies not found');
    }
    return currencies.map((currency) => currency.name);
  }

  public async getCurrencyChangeRate(currency: Currency): Promise<ExchangeRate[]> {
    const currencyEntity = await this.collection.findOne({ name: currency });
    if (!currencyEntity) {
      throw new Error('Currency not found');
    }

    return Object.entries(currencyEntity.rates).map(([currency, exchangeRate]) => ({ currency: currency as Currency, exchangeRate }));
  }

  public async getCurrencyComparison(currency: Currency, currencyToCompare: Currency): Promise<ComparisonRate> {
    const currencyEntity = await this.collection.findOne({ name: currency });
    if (!currencyEntity) {
      throw new Error('Currency not found');
    }

    const exchangeRate = currencyEntity.rates[currencyToCompare];
    if (!exchangeRate) {
      throw new Error('Currency not found');
    }

    return { exchangeRate };
  }
}
