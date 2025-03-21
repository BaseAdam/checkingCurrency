import { injectable, inject } from 'inversify';
import { ComparisonRate, CurrencyRepository, ExchangeRate } from '../repository/currency.repository';
import 'reflect-metadata';
import { Currency } from '../middleware/middleware';

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
}
