import { join } from 'path';

export class Config {
  public getCurrenciesPath(): string {
    return join(__filename, '..', 'currencies.json');
  }
}
