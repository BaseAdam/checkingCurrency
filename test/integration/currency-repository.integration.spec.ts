import { GenericContainer, StartedTestContainer } from 'testcontainers';
import { Collection } from 'mongodb';
import { MongoDatabase } from '../../src/mongo-database';
import { ComparisonRate, CurrencyEntity, CurrencyRepository, ExchangeRate } from '../../src/repository/currency.repository';
import { Currency } from '../../src/middleware/middleware';

describe('Currency Repository Integration Test', () => {
  const mainCurrency = Currency.USD;
  const currencyToCompare = Currency.CHF;
  let mongoContainer: StartedTestContainer;
  let mongoDatabase: MongoDatabase;
  let collection: Collection<CurrencyEntity>;

  beforeAll(async () => {
    mongoContainer = await new GenericContainer('mongo').withExposedPorts(27017).start();
    const uri = `mongodb://localhost:${mongoContainer.getMappedPort(27017)}`;
    mongoDatabase = await MongoDatabase.start(uri);
    collection = mongoDatabase.getCollection('Currencies') as unknown as Collection<CurrencyEntity>;
  });

  it('should return values from db', async () => {
    // given
    const currencyNames = ['USD', 'PLN', 'EUR', 'GBP', 'CHF'];
    const currencyRepository = new CurrencyRepository(collection);

    // when
    const result = await currencyRepository.getAllCurrencies();

    // expect Currency array using jest matchers
    expect(result).toEqual(currencyNames);
  });

  it('should return exchange rate of given currency', async () => {
    // given
    const exchangeRates: ExchangeRate[] = [
      { currency: Currency.PLN, exchangeRate: 3.77 },
      { currency: Currency.EUR, exchangeRate: 0.89 },
      { currency: Currency.GBP, exchangeRate: 0.79 },
      { currency: Currency.CHF, exchangeRate: 0.99 },
    ];
    const currencyRepository = new CurrencyRepository(collection);
    // when
    const result = await currencyRepository.getCurrencyChangeRate(mainCurrency);

    // expect Currency array using jest matchers
    expect(result).toStrictEqual(exchangeRates);
  });

  it('should return exchange rate of currency comparison', async () => {
    //given
    const exchangeRate: ComparisonRate[] = [{ exchangeRate: 0.99 }];
    const currencyRepository = new CurrencyRepository(collection);
    //when
    const result = await currencyRepository.getCurrencyComparison(mainCurrency, currencyToCompare);

    //then
    expect([result]).toStrictEqual(exchangeRate);
  });

  afterAll(async () => {
    await mongoDatabase.stop();
    await mongoContainer.stop();
  });
});
