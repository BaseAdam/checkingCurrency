import { ComparisonRate, CurrencyEntity, CurrencyRepository, ExchangeRate } from './currency.repository';
import { when, instance, mock, anything } from 'ts-mockito';
import { Currency } from './currency.repository';
import { Collection, FindCursor, ObjectId, WithId } from 'mongodb';

describe('currency repository - unit test', () => {
  let currencyRepository: CurrencyRepository;
  let collectionMock: Collection<CurrencyEntity>;
  let findCursorMock: FindCursor<WithId<CurrencyEntity>>;
  let idMock: ObjectId;

  beforeEach(() => {
    collectionMock = mock(Collection<CurrencyEntity>);
    findCursorMock = mock(instance(FindCursor<CurrencyEntity>));
    idMock = mock(ObjectId);
    currencyRepository = new CurrencyRepository(instance(collectionMock));
  });

  it('should return values from db', async () => {
    //given
    const currencyNames = ['USD', 'PLN'];
    const currencyEntity: WithId<CurrencyEntity>[] = [
      { _id: idMock, name: 'USD', rates: { PLN: 3.77, EUR: 0.89, GBP: 0.79, CHF: 0.99 } },
      { _id: idMock, name: 'PLN', rates: { USD: 0.27, EUR: 0.24, GBP: 0.21, CHF: 0.26 } },
    ];
    when(findCursorMock.toArray()).thenResolve(currencyEntity);
    when(collectionMock.find()).thenReturn(instance(findCursorMock));
    //when
    const result = await currencyRepository.getAllCurrencies();

    //expect
    expect(result).toEqual(currencyNames);
  });

  it('should return exchange rate of given currency', async () => {
    //given
    const mainCurrency = Currency.USD;
    const currencyEntity: WithId<CurrencyEntity> = { _id: idMock, name: 'USD', rates: { PLN: 3.77, EUR: 0.89, GBP: 0.79, CHF: 0.99 } };
    const exchangeRates: ExchangeRate[] = [
      { currency: Currency.PLN, exchangeRate: 3.77 },
      { currency: Currency.EUR, exchangeRate: 0.89 },
      { currency: Currency.GBP, exchangeRate: 0.79 },
      { currency: Currency.CHF, exchangeRate: 0.99 },
    ];
    when(collectionMock.findOne(anything())).thenResolve(currencyEntity);
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
    const currencyEntity: WithId<CurrencyEntity> = { _id: idMock, name: 'USD', rates: { PLN: 3.77, EUR: 0.89, GBP: 0.79, CHF: 0.99 } };
    when(collectionMock.findOne(anything())).thenResolve(currencyEntity);
    //when
    const result = await currencyRepository.getCurrencyComparison(mainCurrency, currencyToCompare);

    //then
    expect(result).toStrictEqual(exchangeRate);
  });
});
