import { inject, injectable } from 'inversify';
import { Currency, supportedCurrencies } from '../types/currencies';
import { CurrencyEntity } from '../types/exchangeRates';
import 'reflect-metadata';

export type CurrencyExternalApiResponse = { conversion_rates: Record<string, number> };

@injectable()
export class CurrencyAdapter {
  constructor(@inject('CURRENCY_API_KEY') private readonly apiKey: string) {}

  public async fetchLatestRates(baseCurrency: Currency): Promise<CurrencyEntity> {
    const response = await fetch(`https://v6.exchangerate-api.com/v6/${this.apiKey}/latest/${baseCurrency}`);

    if (!response.ok) {
      throw new Error(`Failed to fetch exchange rates: ${response.statusText}`);
    }

    const data: CurrencyExternalApiResponse = (await response.json()) as CurrencyExternalApiResponse;
    const supportedRates = Object.entries(data.conversion_rates)
      .filter(([currency]) => supportedCurrencies.includes(currency as Currency))
      .reduce((acc, [currency, rate]) => {
        acc[currency] = rate;
        return acc;
      }, {} as Record<string, number>);

    return {
      name: baseCurrency,
      rates: supportedRates
    };
  }
}
