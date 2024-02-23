import { instance, when } from 'ts-mockito';
import { CurrencyRepository, Currency, ExchangeRate, ComparisonRate, CollectionType } from '../../src/repository/currency.repository';
import { CurrencyService } from '../../src/service/currency.service';
import { join } from 'path';
import { GenericContainer, Network, StartedTestContainer, StartedNetwork } from 'testcontainers';
import { Collection } from 'mongodb';

describe('Currency Service Integration Test', () => {
  let collectionMock: Collection<CollectionType>;
  const mainCurrency = Currency.USD;
  const currencyToCompare = Currency.CHF;
  let mongoContainer: StartedTestContainer;
  let network: StartedNetwork;

  beforeAll(async () => {
    network = await new Network().start();
    mongoContainer = await new GenericContainer('mongo').withName('test_mongo').withNetworkMode(network.getName()).start();
  });

  beforeEach(() => {
    collectionMock = {
      aggregate: jest.fn().mockReturnThis(),
      toArray: jest.fn(),
    } as unknown as Collection<CollectionType>;
  });

  it('should return values from db', async () => {
    // given
    const currencyNames = ['USD', 'PLN'];
    when(collectionMock.aggregate().toArray()).thenResolve([{ _id: null, currencies: ['USD', 'PLN'] }]);
    const currencyRepository = new CurrencyRepository(collectionMock);

    // when
    const result = await currencyRepository.getAllCurrencies();

    // expect Currency array using jest matchers
    expect(result).toEqual(currencyNames);
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

    const exchangeRates: ExchangeRate[] = [
      { currency: Currency.PLN, exchangeRate: 3.77 },
      { currency: Currency.EUR, exchangeRate: 0.89 },
      { currency: Currency.GBP, exchangeRate: 0.79 },
      { currency: Currency.CHF, exchangeRate: 0.99 },
    ];

    // when
    const result = await currencyService.getCurrencyChangeRate(mainCurrency);

    // expect Currency array using jest matchers
    expect(result).toStrictEqual(exchangeRates);
  });

  it('should return exchange rate of currency comparison', async () => {
    //given
    when(configMock.getCurrenciesPath()).thenReturn(join(__filename, '..', '__mocks__', 'valid-currencies.json'));
    const currencyService = new CurrencyService(new CurrencyRepository(instance(configMock)));

    const exchangeRate: ComparisonRate = { exchangeRate: 0.99 };

    //when
    const result = await currencyService.getCurrencyComparison(mainCurrency, currencyToCompare);

    //then
    expect(result).toStrictEqual(exchangeRate);
  });

  afterAll(async () => {
    await mongoContainer.stop();
    await network.stop();
  });
});
