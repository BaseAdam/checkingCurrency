import { Currency } from '../types/currencies';
import { CurrencyService } from './currency.service';
import { mock, when, instance } from 'ts-mockito';
import { CurrencyRepository } from '../repository/currency.repository';
import { ComparisonRate, ExchangeRate } from '../types/exchangeRates';

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
    const mainCurrency = Currency.USD;
    const exchangeRate: ExchangeRate[] = [
      { currency: Currency.PLN, exchangeRate: 3.77 },
      { currency: Currency.EUR, exchangeRate: 0.89 },
    ];

    when(currencyRepositoryMock.getCurrencyChangeRate(mainCurrency)).thenResolve(exchangeRate);

    // when
    const result = await currencyService.getCurrencyChangeRate(mainCurrency);

    // then
    expect(result).toEqual(exchangeRate);
  });

  it('should return exchange rate of currency comparison', async () => {
    //given
    const mainCurrency = Currency.USD;
    const currencyToCompare = Currency.PLN;
    const exchangeRate: ComparisonRate = { exchangeRate: 6.0 };

    when(currencyRepositoryMock.getCurrencyComparison(mainCurrency, currencyToCompare)).thenResolve(exchangeRate);

    //when
    const result = await currencyService.getCurrencyComparison(mainCurrency, currencyToCompare);

    //then
    expect(result).toEqual(exchangeRate);
  });
});
