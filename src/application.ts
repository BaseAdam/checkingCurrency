import express from 'express';
import { Server } from 'http';
import * as path from 'path';
import 'reflect-metadata';
import { container } from './inversify.config';
import { MongoDatabase } from './mongo-database';
import { Routes } from './routes/routes';
import { Config } from './config/config';
import { Scheduler } from './jobs/fetchRatesJob';

export class Application {
  constructor(
    private readonly app: express.Express,
    private readonly server: Server,
    private database: MongoDatabase,
    private readonly routes: Routes,
  ) {
    const currencyRouter = this.routes.registerRoutes();
    app.use('/api', currencyRouter);
  }

  public static async start(): Promise<Application> {
    const config = container.get(Config);
    const cronJob: Scheduler = await container.getAsync(Scheduler);
    await cronJob.fetchCurrencyRates();

    const app = express();
    app.use('/assets', express.static(path.join(__dirname, 'assets')));

    const server = app.listen(config.getPort(), () => {
      console.log(`Listening at http://localhost:${config.getPort()}/api`);
    });
    server.on('error', console.error);

    return new Application(app, server, await container.getAsync(MongoDatabase), await container.getAsync(Routes));
  }

  public async stop(): Promise<void> {
    this.database.stop();
    this.server.close();
    this.app.removeAllListeners();
  }
}
