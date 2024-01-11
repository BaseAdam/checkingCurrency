import axios, { Axios } from 'axios';
import { ComparisonRate, ExchangeRate } from '../../../src/repository/currency.repository';
import { Currency } from '../../../src/repository/currency.repository';

export class ApiCalls {
  private readonly httpClient: Axios;

  constructor(private readonly basePath: string) {
    this.httpClient = axios.create({
      baseURL: basePath,
      timeout: 10000,
    });
  }

  public async getCurrencies(): Promise<Currency> {
    const response = await this.httpClient.get('/currency');
    return response.data;
  }

  public async getExchangeRate(): Promise<ExchangeRate> {
    const response = await this.httpClient.get('/currency/USD');
    return response.data;
  }

  public async getCurrencyComparison(): Promise<ComparisonRate> {
    const response = await this.httpClient.get('/currency/USD?compare_to=EUR');
    return response.data;
  }
}
