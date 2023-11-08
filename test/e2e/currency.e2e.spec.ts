import { ApiCalls } from './utils/ApiCalls';
import { TestApplication } from './utils/TestApplication';

describe('Currency E2E Test', () => {
  let apiCalls: ApiCalls;
  let testApp: TestApplication;

  beforeEach(async () => {
    testApp = await TestApplication.start();
    apiCalls = new ApiCalls(testApp.getBasePath());
  });

  afterEach(async () => {
    await testApp.stop();
  });

  it('should return all currencies', async () => {
    // when
    const result = await apiCalls.getCurrencies();

    // then
    expect(result).toEqual(['USD', 'PLN', 'EUR', 'GBP', 'CHF']);
  });
});
