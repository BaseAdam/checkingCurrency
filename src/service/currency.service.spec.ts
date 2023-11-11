import {
  Currency,
  CurrencyRepository,
} from '../repository/currency.repository';
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
    when(currencyRepositoryMock.getAllCurrencies()).thenResolve(
      testedCurrencies
    );

    // when
    const result = await currencyService.getAllCurrencies();

    // then
    expect(result).toEqual(testedCurrencies);
  });
});
