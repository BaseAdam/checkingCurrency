import { readFileSync } from 'fs';
import { join } from 'path';

export class CurrencyRepository {
    private readonly currencies;
  
    constructor() {
      this.currencies = JSON.parse(
        readFileSync(join(__filename, '..', 'config', 'currencies.json'), 'utf-8')
      ).currencies;
    }
}