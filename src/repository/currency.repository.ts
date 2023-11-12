import { readFileSync } from "fs";
import { Config } from "../config/config";

export enum Currency {
  USD = "USD",
  PLN = "PLN",
  EUR = "EUR",
  GBP = "GBP",
  CHF = "CHF",
}

export type Currencies = {
  currencies: {
    [outerKey in Currency]: Record<Currency, number>;
  };
};
export const validateCurrency = (currency: string | undefined, currencyToCompare: string | undefined): string | undefined => {
  if (
    currency !== currencyToCompare &&
    Object.keys(Currency).find((key) => key === currency) &&
    Object.keys(Currency).find((value) => value === currencyToCompare)
  ) {
    return currency, currencyToCompare;
  } else {
    throw new Error("Type correct currencies");
  }
};
export class CurrencyRepository {
  private readonly currencies: Currencies;

  constructor(private readonly config: Config) {
    this.currencies = JSON.parse(readFileSync(this.config.getCurrenciesPath(), "utf-8")).currencies;
  }

  public async getCurrencyComparison(currency: string, currencyToCompare: string): Promise<object | undefined> {
    const currencyEntries = Object.entries(this.currencies);
    const chosenCurrency = currencyEntries.find(([key]) => key === currency);
    if (chosenCurrency) {
      const exchangeRate = Object.entries(chosenCurrency[1]).find(([value]) => value === currencyToCompare);
      return { currency, exchangeRate };
    }
  }
}
