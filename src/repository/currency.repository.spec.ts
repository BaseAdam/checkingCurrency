import { Config } from '../config/config';
import { Currency, CurrencyRepository } from './currency.repository';
import { mock, when, instance } from 'ts-mockito';
import { join } from 'path';

describe('currency repository - unit test', () => {
  let configMock: Config;

  beforeEach(() => {
    configMock = mock(Config);
  });

  it('should return values from file', async () => {
    //given
    when(configMock.getCurrenciesPath()).thenReturn(
      join(__filename, '..', '..', 'config', 'currencies.json')
    );
    const currencyRepository = new CurrencyRepository(instance(configMock));

    //when
    const result = await currencyRepository.getAllCurrencies();

    //expect
    result.forEach((currency) => {
      expect(Object.values(Currency).includes(currency)).toEqual(true);
    });
  });
});
