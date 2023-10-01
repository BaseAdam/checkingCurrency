import { readFileSync } from 'fs';
import { join } from 'path';

export type Currencies = {
  USD?: Object;
  PLN?: Object;
  EUR?: Object;
  GBP?: Object;
  CHF?: Object;
}

export class CurrencyRepository {
    private readonly currencies: String;


    constructor() {
      this.currencies = this.currencies = JSON.parse(
        readFileSync(join(__filename, '..', '..', '..', 'src', 'config', 'currencies.json'), 'utf-8')
      ).currencies;
    }

    public async getCurrencyComparison(currency: String, currencyToCompare: String): Promise<Object | undefined> {
      const currencyEntries = Object.entries(this.currencies)

      if (currency !== currencyToCompare) {
        const chosenCurrency = currencyEntries.find(([key]) => key === currency)
        const exchangeRate = chosenCurrency ? Object.entries(chosenCurrency[1]).find(([value]) => value === currencyToCompare) : currencyEntries
        return {currency, exchangeRate}
      }
      else {
        return "Currencies to compare are the same, change one of them"
      }
    }
}