import express from 'express';
import { Server } from 'http';
import * as path from 'path';
import { Routes } from './routes/routes';
import { MongoDatabase } from './mongo-database';
import { Config } from './config/config';
import 'reflect-metadata';
import { container } from './inversify.config';
import { Collection } from 'mongodb';

export class Application {
  private constructor(
    private readonly app: express.Express,
    private database: MongoDatabase,
    private readonly server: Server,
    private readonly routes: Routes,
  ) {
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

    container.bind(Server).toConstantValue(server);
    container.bind(MongoDatabase).toDynamicValue(async () => {
      const database = await MongoDatabase.connect(config.getDatabaseUri());
      return database;
    });
    const database = await container.get(MongoDatabase);
    container.bind<Collection>('CollectionCurrency').toDynamicValue(async () => await database.getCollection('Currencies'));
    container.bind(express()).toConstantValue(app);

    return container.get(app);
  }

  public async stop(): Promise<void> {
    this.database.stop();
    this.server.close();
    this.app.removeAllListeners();
  }
}
