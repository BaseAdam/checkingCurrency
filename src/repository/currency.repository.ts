import { Collection } from 'mongodb';
import dotenv from 'dotenv';
import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { Currency } from '../types/currencies';

dotenv.config();

export type ExchangeRate = { currency: Currency; exchangeRate: number };
export type ComparisonRate = { exchangeRate: number };
export type CurrencyEntity = { name: string; rates: Record<string, number>; lastUpdated: Date };
@injectable()
export class CurrencyRepository {
  constructor(@inject('CollectionCurrency') private collection: Collection<CurrencyEntity>) {}

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
