import express from 'express';
import { Server } from 'http';
import * as path from 'path';
import { CurrencyController } from './controller/currency.controller';
import { CurrencyRepository } from './repository/currency.repository';
import { Routes } from './routes/routes';
import { CurrencyService } from './service/currency.service';
import { ValidationMiddlewareFactory } from './middleware/middleware';
import { MongoDatabase } from './mongo-database';
import { Config } from './config/config';

export class Application {
  private readonly routes: Routes;

  private constructor(
    private readonly app: express.Express,
    private database: MongoDatabase,
    private readonly server: Server,
  ) {
    this.routes = new Routes(
      new CurrencyController(new CurrencyService(new CurrencyRepository(database.getCollection('Currencies')))),
      new ValidationMiddlewareFactory(),
    );
    const currencyRouter = this.routes.registerRoutes();
    app.use('/api', currencyRouter);
  }

  public static async start(config: Config): Promise<Application> {
    const app = express();
    app.use('/assets', express.static(path.join(__dirname, 'assets')));

    const port = config.getPort();
    const server = app.listen(port, () => {
      console.log(`Listening at http://localhost:${port}/api`);
    });
    server.on('error', console.error);

    const database = await MongoDatabase.connect(config.getDatabaseUri());

    return new Application(app, database, server);
  }

  public async stop(): Promise<void> {
    this.database.stop();
    this.server.close();
    this.app.removeAllListeners();
  }
}
