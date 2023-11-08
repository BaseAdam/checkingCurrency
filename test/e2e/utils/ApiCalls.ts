import axios, { Axios } from 'axios';
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
}
