import { instance, mock, when } from 'ts-mockito';
import { Config } from '../../src/config/config';
import { CurrencyRepository, Currency, ExchangeRate } from '../../src/repository/currency.repository';
import { CurrencyService } from '../../src/service/currency.service';
import { join } from 'path';

describe('Currency Service Integration Test', () => {
  let configMock: Config;
  const mainCurrency = 'USD';

  beforeEach(() => {
    configMock = mock(Config);
  });

  it('should return values from file', async () => {
    // given
    when(configMock.getCurrenciesPath()).thenReturn(join(__filename, '..', '__mocks__', 'valid-currencies.json'));
    const currencyService = new CurrencyService(new CurrencyRepository(instance(configMock)));

    // when
    const result = await currencyService.getAllCurrencies();

    // expect Currency array using jest matchers
    result.forEach((currency) => {
      expect(Object.values(Currency).includes(currency)).toEqual(true);
    });
  });

  it('should throw when invalid file is provided', async () => {
    // given
    when(configMock.getCurrenciesPath()).thenReturn(join(__filename, '..', '__mocks__', 'invalid-currencies.json'));
    try {
      new CurrencyService(new CurrencyRepository(instance(configMock)));
    } catch (e: unknown) {
      expect(e).toBeInstanceOf(Error);
      expect((e as Error).name).toEqual('SyntaxError');
    }
  });
  it('should return exchange rate of given currency', async () => {
    // given
    when(configMock.getCurrenciesPath()).thenReturn(join(__filename, '..', '__mocks__', 'valid-currencies.json'));
    const currencyService = new CurrencyService(new CurrencyRepository(instance(configMock)));

    const exchangeRate: ExchangeRate[] = [
      { currency: Currency.PLN, exchangeRate: 3.77 },
      { currency: Currency.EUR, exchangeRate: 0.89 },
      { currency: Currency.GBP, exchangeRate: 0.79 },
      { currency: Currency.CHF, exchangeRate: 0.99 },
    ];

    // when
    const result = await currencyService.getCurrencyChangeRate(mainCurrency);

    // expect Currency array using jest matchers
    expect(result).toMatchObject({ exchangeRate });
  });
});
