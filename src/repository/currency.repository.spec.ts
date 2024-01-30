import { CollectionType, ComparisonRate, CurrencyRepository, ExchangeRate } from './currency.repository';
import { when, instance } from 'ts-mockito';
import { Currency } from './currency.repository';
import { Collection } from 'mongodb';

describe('currency repository - unit test', () => {
  let currencyRepository: CurrencyRepository;
  let collectionMock: Collection<CollectionType>;

  beforeEach(() => {
    collectionMock = {
      aggregate: jest.fn().mockReturnThis(),
      toArray: jest.fn(),
    } as unknown as Collection<CollectionType>;
    when(collectionMock.aggregate().toArray()).thenResolve([{ _id: null, currencies: ['USD', 'PLN'] }]);
    currencyRepository = new CurrencyRepository(instance(collectionMock));
  });

  it('should return values from db', async () => {
    //given
    const currencyNames = ['USD', 'PLN'];
    //when
    const result = await currencyRepository.getAllCurrencies();

    //expect
    expect(result).toEqual(currencyNames);
  });

  it('should return exchange rate of given currency', async () => {
    //given
    const mainCurrency = Currency.USD;
    const exchangeRates: ExchangeRate[] = [
      { currency: Currency.PLN, exchangeRate: 3.77 },
      { currency: Currency.EUR, exchangeRate: 0.89 },
      { currency: Currency.GBP, exchangeRate: 0.79 },
      { currency: Currency.CHF, exchangeRate: 0.99 },
    ];

    //when
    const result = await currencyRepository.getCurrencyChangeRate(mainCurrency);

    //expect
    expect(result).toStrictEqual(exchangeRates);
  });

  it('should return exchange rate of currency comparison', async () => {
    //given
    const mainCurrency = Currency.USD;
    const currencyToCompare = Currency.EUR;
    const exchangeRate: ComparisonRate = { exchangeRate: 0.89 };

    //when
    const result = await currencyRepository.getCurrencyComparison(mainCurrency, currencyToCompare);

    //then
    expect(result).toStrictEqual(exchangeRate);
  });
});
