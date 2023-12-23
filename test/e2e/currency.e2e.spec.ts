import { ApiCalls } from './utils/ApiCalls';
import { TestApplication } from './utils/TestApplication';

describe('Currency E2E Test', () => {
  let apiCalls: ApiCalls;
  let testApp: TestApplication;

  beforeAll(async () => {
    testApp = await TestApplication.start();
    apiCalls = new ApiCalls(testApp.getBasePath());
  });

  afterAll(async () => {
    await testApp.stop();
  });

  it('should return all currencies', async () => {
    // when
    const result = await apiCalls.getCurrencies();

    // then
    expect(result).toEqual(['USD', 'PLN', 'EUR', 'GBP', 'CHF']);
  });

  it('should return exchange rate of a given currency', async () => {
    // when
    const result = await apiCalls.getExchangeRate();

    // then
    expect(result).toEqual({
      exchangeRates: [
        { currency: 'PLN', exchangeRate: 3.77 },
        { currency: 'EUR', exchangeRate: 0.89 },
        { currency: 'GBP', exchangeRate: 0.79 },
        { currency: 'CHF', exchangeRate: 0.99 },
      ],
    });
  });
});
