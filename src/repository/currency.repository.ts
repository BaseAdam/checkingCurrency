export class CurrencyRepository {
    private readonly currencies: String;

    constructor() {
      this.currencies = "random"
    }

    public async getRandom(): Promise<String> {
      return this.currencies
    }
}