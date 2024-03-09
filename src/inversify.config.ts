import { Container } from 'inversify';
import 'reflect-metadata';
import { CurrencyController } from './controller/currency.controller';
import { CurrencyService } from './service/currency.service';
import { CurrencyRepository } from './repository/currency.repository';
import { ValidationMiddlewareFactory } from './middleware/middleware';
import { Routes } from './routes/routes';
import { Config } from './config/config';

const container = new Container();
container.bind(CurrencyController).toSelf();
container.bind(CurrencyService).toSelf();
container.bind(CurrencyRepository).toSelf();
container.bind(Config).toSelf();
container.bind(ValidationMiddlewareFactory).toSelf();
container.bind(Routes).toSelf();

export { container };
