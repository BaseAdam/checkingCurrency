import { Config } from '../config/config';
import { CurrencyRepository, ExchangeRate } from './currency.repository';
import { mock, when, instance } from 'ts-mockito';
import { join } from 'path';
import { Currency } from './currency.repository';

describe('currency repository - unit test', () => {
  let configMock: Config;

  beforeEach(() => {
    configMock = mock(Config);
  });

  it('should return values from file', async () => {
    //given
    when(configMock.getCurrenciesPath()).thenReturn(join(__filename, '..', '..', 'config', 'currencies.json'));
    const currencyRepository = new CurrencyRepository(instance(configMock));

    //when
    const result = await currencyRepository.getAllCurrencies();

    //expect
    result.forEach((currency) => {
      expect(Object.values(Currency).includes(currency)).toEqual(true);
    });
  });
  it('should return exchange rate of given currency', async () => {
    //given
    when(configMock.getCurrenciesPath()).thenReturn(join(__filename, '..', '..', 'config', 'currencies.json'));
    const currencyRepository = new CurrencyRepository(instance(configMock));
    const mainCurrency = 'USD';
    const exchangeRate: ExchangeRate[] = [
      { currency: Currency.PLN, exchangeRate: 3.77 },
      { currency: Currency.EUR, exchangeRate: 0.89 },
      { currency: Currency.GBP, exchangeRate: 0.79 },
      { currency: Currency.CHF, exchangeRate: 0.99 },
    ];

    //when
    const result = await currencyRepository.getCurrencyChangeRate(mainCurrency);

    //expect
    expect(result).toEqual({ exchangeRate });
  });
});
