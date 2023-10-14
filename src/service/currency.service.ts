import { CurrencyRepository } from '../repository/currency.repository';

export class CurrencyService {
  private readonly currencyRepository: CurrencyRepository;

  constructor() {
    this.currencyRepository = new CurrencyRepository();
  }

  public async getRandom(): Promise<string> {
    return this.currencyRepository.getRandom();
  }
}
