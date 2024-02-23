import { ValidationMiddlewareFunc } from '../middleware/middleware';
import { Collection, Document, ObjectId } from 'mongodb';
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
export type CollectionType = {
  [x: string]: { _id: ObjectId; name: string; rates: Record<string, number> };
};

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
  private readonly exchangeRatesCollection: Collection<CollectionType>;

  constructor(private readonly collection: Collection<CollectionType>) {
    this.exchangeRatesCollection = this.collection;
  }

  public async getAllCurrencies(): Promise<string[]> {
    const pipeline = [
      {
        $group: {
          _id: null,
          currencies: { $push: '$name' },
        },
      },
      {
        $project: {
          currencies: 1,
        },
      },
    ];
    const currencyArray = await this.exchangeRatesCollection.aggregate(pipeline).toArray();
    if (currencyArray[0] && currencyArray[0].currencies) {
      const currencyNames = currencyArray[0].currencies;
      return currencyNames;
    } else {
      throw new Error('Currencies not found');
    }
  }

  public async getCurrencyChangeRate(currency: Currency): Promise<Document[]> {
    const pipeline = [
      { $match: { name: currency } },
      {
        $project: {
          name: 1,
          ratesArray: { $objectToArray: '$rates' },
        },
      },
      {
        $unwind: '$ratesArray',
      },
      {
        $project: {
          _id: 0,
          currency: '$ratesArray.k',
          exchangeRate: '$ratesArray.v',
        },
      },
    ];
    const currenciesArray = await this.exchangeRatesCollection.aggregate(pipeline).toArray();
    if (currenciesArray) {
      return currenciesArray;
    } else {
      throw new Error('Currency not found');
    }
  }

  public async getCurrencyComparison(currency: Currency, currencyToCompare: Currency): Promise<Document> {
    const pipeline = [
      { $match: { name: currency } },
      { $group: { _id: `$rates.${currencyToCompare}` } },
      { $project: { _id: 0, exchangeRate: '$_id' } },
    ];
    const currenciesArray = await this.exchangeRatesCollection.aggregate(pipeline).toArray();
    if (currenciesArray[0]) {
      return currenciesArray[0];
    } else {
      throw new Error('Currency not found');
    }
  }
}
