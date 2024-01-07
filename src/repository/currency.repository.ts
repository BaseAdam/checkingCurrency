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
  //checking if currency.params exist
  if (currency.params) {
    //tranfsorm object { currency: givenCurrencyName } into array with name of currency
    const params = Object.values(currency.params);
    //taking the only element of this array as a name
    const currencyName = params[0];
    //checking if currency of given name exist
    if (Object.keys(Currency).find((key) => key === currencyName)) {
      return;
    } else {
      throw new Error('Currency not found');
    }
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
    //checking if given currency exist in this.currencies
    const currencyWithExchangeRates = Object.entries(this.currencies).find((key) => key[0] === currency);
    // if exist then take only exchange rates without name of given currency
    if (currencyWithExchangeRates) {
      const exchangeRatesOfGivenCurrency = currencyWithExchangeRates[1];
      //transform array with exchange rates to object with array of type ExchnageRate[]
      const exchangeRates = Object.entries(exchangeRatesOfGivenCurrency).map(([currency, exchangeRate]) => ({ currency, exchangeRate }));
      return Object.assign({ exchangeRates });
    } else {
      const exchangeRates: ExchangeRate[] = [];
      return Object.assign({ exchangeRates });
    }
  }
}
