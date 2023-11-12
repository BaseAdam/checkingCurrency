import { CurrencyRepository } from "../repository/currency.repository";

export class CurrencyService {
  private readonly currencyRepository: CurrencyRepository;

  constructor(currencyRepository: CurrencyRepository) {
    this.currencyRepository = currencyRepository;
  }

  public async getCurrencyComparison(currency: string, currencyToCompare: string): Promise<object | undefined | string> {
    return this.currencyRepository.getCurrencyComparison(currency, currencyToCompare);
  }
}
