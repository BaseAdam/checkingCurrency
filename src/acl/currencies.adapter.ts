import { inject, injectable } from 'inversify';
import { Currency } from '../types/currencies';
import { CurrencyEntity } from '../types/exchangeRates';

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
    return {
      name: baseCurrency,
      rates: data.conversion_rates,
    };
  }
}
