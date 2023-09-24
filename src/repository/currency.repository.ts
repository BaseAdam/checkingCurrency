import { readFileSync } from 'fs';
import { join } from 'path';

export class CurrencyRepository {
    private readonly currencies: String;


    constructor() {
      this.currencies = "random"
    }

    public async getRandom(): Promise<String>{
      return this.currencies
    }
}