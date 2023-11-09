import { Currency, CurrencyRepository } from './currency.repository';
import { mock, when, instance } from 'ts-mockito';

const currencyRepositoryMock = mock(CurrencyRepository);

describe('currency repository - unit test', () => {
  it('should return all currencies', async (): Promise<void> => {
    const cryptoCurrency = ['ETH', 'BTC', 'RVN', 'USDT'];

    when(currencyRepositoryMock.getAllCurrencies()).thenResolve([
      Currency.CHF,
      Currency.EUR,
    ]);

    const currencyRepository = instance(currencyRepositoryMock);
    const testCurrencies = await currencyRepository.getAllCurrencies();
    expect(testCurrencies).toEqual(cryptoCurrency);
  });
});
