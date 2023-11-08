import {
  Currency,
  CurrencyRepository,
} from '../repository/currency.repository';

export class CurrencyService {
  private readonly currencyRepository: CurrencyRepository;

  constructor(currencyRepository: CurrencyRepository) {
    this.currencyRepository = currencyRepository;
  }

  public async getAllCurrencies(): Promise<Currency[]> {
    return this.currencyRepository.getAllCurrencies();
  }
}
