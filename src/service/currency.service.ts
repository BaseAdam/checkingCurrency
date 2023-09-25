import { CurrencyRepository } from '../repository/currency.repository';
import { Currency } from '../repository/currency.repository';

export class CurrencyService {
  private readonly currencyRepository: CurrencyRepository;

  constructor() {
    this.currencyRepository = new CurrencyRepository();
  }

  public async getAllCurrencies(): Promise<Currency> {
    return this.currencyRepository.getAllCurrencies();
  }
}
