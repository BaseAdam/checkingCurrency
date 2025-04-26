import { GenericContainer, StartedTestContainer } from 'testcontainers';
import { Collection } from 'mongodb';
import { MongoDatabase } from '../../src/mongo-database';
import { CurrencyRepository } from '../../src/repository/currency.repository';
import { Currency, supportedCurrencies } from '../../src/types/currencies';
import { CurrencyAdapter } from '../../src/acl/currencies.adapter';
import { CurrencyEntity } from '../../src/types/exchangeRates';

describe('Currency Repository Integration Test', () => {
  const mainCurrency = Currency.USD;
  const currencyToCompare = Currency.CHF;
  let mongoContainer: StartedTestContainer;
  let mongoDatabase: MongoDatabase;
  let collection: Collection<CurrencyEntity>;
  let adapter: CurrencyAdapter;

  beforeAll(async () => {
    mongoContainer = await new GenericContainer('mongo').withExposedPorts(27017).start();
    const uri = `mongodb://localhost:${mongoContainer.getMappedPort(27017)}`;
    mongoDatabase = await MongoDatabase.start(uri);
    collection = mongoDatabase.getCollection('Currencies') as unknown as Collection<CurrencyEntity>;
    adapter = new CurrencyAdapter(process.env.CURRENCY_API_KEY ?? '');
  });

  it('should return values from db', async () => {
    // given
    const currencyRepository = new CurrencyRepository(collection, adapter);

    // when
    const result = await currencyRepository.getAllCurrencies();

    // expect Currency array using jest matchers
    expect(result).toEqual(supportedCurrencies);
  });

  it('should return exchange rate of given currency', async () => {
    // given
    await collection.updateOne(
      { name: Currency.USD },
      {
        $set: {
          rates: {
            [Currency.CHF]: 0.91,
            [Currency.EUR]: 0.85,
          },
        },
      },
    );

    const currencyRepository = new CurrencyRepository(collection, adapter);

    // when
    const result = await currencyRepository.getCurrencyChangeRate(mainCurrency);

    // then
    expect(result).toStrictEqual([
      { currency: Currency.CHF, exchangeRate: 0.91 },
      { currency: Currency.EUR, exchangeRate: 0.85 },
    ]);
  });

  it('should return exchange rate of currency comparison', async () => {
    // given
    await collection.updateOne(
      { name: Currency.USD },
      {
        $set: {
          rates: {
            [Currency.CHF]: 0.91,
            [Currency.EUR]: 0.85,
          },
        },
      },
    );

    const currencyRepository = new CurrencyRepository(collection, adapter);

    // when
    const result = await currencyRepository.getCurrencyComparison(mainCurrency, currencyToCompare);

    // then
    expect(result).toStrictEqual({
      exchangeRate: 0.91,
    });
  });
});
