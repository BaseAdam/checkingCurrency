import { CurrencyRepository, ExchangeRate } from '../repository/currency.repository';
import { Currency } from '../repository/currency.repository';

export class CurrencyService {
  private readonly currencyRepository: CurrencyRepository;

  constructor(currencyRepository: CurrencyRepository) {
    this.currencyRepository = currencyRepository;
  }

  public async getAllCurrencies(): Promise<Currency[]> {
    return this.currencyRepository.getAllCurrencies();
  }

  public async getCurrencyChangeRate(currency: Currency): Promise<ExchangeRate[]> {
    return this.currencyRepository.getCurrencyChangeRate(currency);
  }
}
