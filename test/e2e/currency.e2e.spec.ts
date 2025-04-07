import { CurrencyExternalApiResponse } from '../../src/middleware/middleware';
import { supportedCurrencies } from '../../src/types/currencies';
import { ApiCalls } from './utils/ApiCalls';
import { TestApplication } from './utils/TestApplication';

describe('Currency E2E Test', () => {
  let apiCalls: ApiCalls;
  let testApp: TestApplication;
  let currencyData: CurrencyExternalApiResponse;

  beforeAll(async () => {
    testApp = await TestApplication.start();
    apiCalls = new ApiCalls(testApp.getBasePath());
    //fetch latest rates from external API to get proper values
    const response = await fetch(`https://v6.exchangerate-api.com/v6/${process.env.CURRENCY_API_KEY ?? ''}/latest/USD`);
    currencyData = (await response.json()) as CurrencyExternalApiResponse;
  });

  afterAll(async () => {
    await testApp.stop();
  });

  it('should return all currencies', async () => {
    // when
    const result = await apiCalls.getCurrencies();

    // then
    expect(result).toEqual(expect.arrayContaining(supportedCurrencies));
  });

  it('should return exchange rate of currency comparison', async () => {
    //when
    const result = await apiCalls.getCurrencyComparison();

    //then
    expect(result).toEqual({ exchangeRate: currencyData.conversion_rates.EUR });
  });
});
