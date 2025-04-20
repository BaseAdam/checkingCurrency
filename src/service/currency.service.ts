import { injectable, inject } from 'inversify';
import 'reflect-metadata';
import { Currency } from '../types/currencies';
import { CurrencyRepository } from '../repository/currency.repository';
import { ComparisonRate, ExchangeRate } from '../types/exchangeRates';

@injectable()
export class CurrencyService {
  constructor(@inject(CurrencyRepository) private currencyRepository: CurrencyRepository) {}

  public async getAllCurrencies(): Promise<string[]> {
    return this.currencyRepository.getAllCurrencies();
  }

  public async getCurrencyChangeRate(currency: Currency): Promise<ExchangeRate[]> {
    return this.currencyRepository.getCurrencyChangeRate(currency);
  }

  public async getCurrencyComparison(currency: Currency, currencyToCompare: Currency): Promise<ComparisonRate> {
    if (currency === currencyToCompare) {
      return { exchangeRate: 1 };
    }

    return this.currencyRepository.getCurrencyComparison(currency, currencyToCompare);
  }

  public async updateExchangeRates(): Promise<void> {
    await this.currencyRepository.updateCurrencyRates();
  }
}
