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
    [outerKey in Currency]: Record<Currency, number>
  }
}

export class CurrencyRepository {
  private readonly currencies: Currencies

  constructor() {
    this.currencies = JSON.parse(
      readFileSync(
        join(__filename, '..', '..', 'config', 'currencies.json'),
        'utf-8'
      )
    ).currencies
  }

    public async getCurrencyComparison(currency: String, currencyToCompare: String): Promise<Object | undefined> {
      return this.currencies
    }
    //   const currencyEntries = Object.entries(this.currencies)

    //   if (currency !== currencyToCompare) {
    //     const chosenCurrency = currencyEntries.find(([key]) => key === currency)
    //     const exchangeRate = chosenCurrency ? Object.entries(chosenCurrency[1]).find(([value]) => value === currencyToCompare) : currencyEntries
    //     return {currency, exchangeRate}
    //   }
    //   else {
    //     return "Currencies to compare are the same, change one of them"
    //   }
    // }
}

