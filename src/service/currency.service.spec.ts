import { Currency, CurrencyRepository, ExchangeRate } from '../repository/currency.repository';
import { CurrencyService } from './currency.service';
import { mock, when, instance } from 'ts-mockito';

describe('currency service - unit test', () => {
  let currencyService: CurrencyService;
  let currencyRepositoryMock: CurrencyRepository;

  beforeEach(() => {
    currencyRepositoryMock = mock(CurrencyRepository);

    currencyService = new CurrencyService(instance(currencyRepositoryMock));
  });

  it('should return all currencies', async () => {
    // given
    const testedCurrencies = [Currency.USD, Currency.PLN];
    when(currencyRepositoryMock.getAllCurrencies()).thenResolve(testedCurrencies);

    // when
    const result = await currencyService.getAllCurrencies();

    // then
    expect(result).toEqual(testedCurrencies);
  });

  it('should return rates of given currency', async () => {
    // given
    const mainCurrency = 'USD';
    const exchangeRate: ExchangeRate = [
      mainCurrency,
      {
        rates: {
          [Currency.PLN]: 2.31,
          [Currency.EUR]: 2.31,
          [Currency.CHF]: 2.31,
          [Currency.USD]: 0,
          [Currency.GBP]: 1.23,
        },
      },
    ];
    when(currencyRepositoryMock.getCurrencyChangeRate(mainCurrency)).thenResolve(exchangeRate);

    // when
    const result = await currencyService.getCurrencyChangeRate(mainCurrency);

    // then
    expect(result).toEqual(exchangeRate);
  });
});
