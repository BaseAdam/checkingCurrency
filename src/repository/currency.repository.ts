export class CurrencyRepository {
  private readonly currencies: string;

  constructor() {
    this.currencies = 'random';
  }

  public async getRandom(): Promise<string> {
    return this.currencies;
  }
}
