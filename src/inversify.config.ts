import { Container } from 'inversify';
import 'reflect-metadata';
import { Config } from './config/config';
import { CurrencyController } from './controller/currency.controller';
import { CurrencyUpdateMiddleware, ValidationMiddlewareFactory } from './middleware/middleware';
import { MongoDatabase } from './mongo-database';
import { CurrencyRepository } from './repository/currency.repository';
import { Routes } from './routes/routes';
import { CurrencyService } from './service/currency.service';

const container = new Container();
container.bind(CurrencyController).toSelf();
container.bind(CurrencyService).toSelf();
container.bind(CurrencyRepository).toSelf();
container.bind(Config).toSelf().inSingletonScope();
container.bind(ValidationMiddlewareFactory).toSelf();
container.bind(Routes).toSelf().inSingletonScope();
container.bind(CurrencyUpdateMiddleware).toSelf();
container.bind('CURRENCY_API_KEY').toConstantValue(process.env.CURRENCY_API_KEY ?? '');
container
  .bind(MongoDatabase)
  .toDynamicValue(async ({ container }) => {
    const config = container.get(Config);
    const database = await MongoDatabase.start(config.getDatabaseUri());
    return database;
  })
  .inSingletonScope();
container
  .bind('CollectionCurrency')
  .toDynamicValue(async ({ container }) => {
    const database = await container.getAsync(MongoDatabase);
    return database.getCollection('Currencies');
  })
  .inSingletonScope();

export { container };
