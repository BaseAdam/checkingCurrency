import express from 'express';
import { Server } from 'http';
import * as path from 'path';
import { Routes } from './routes/routes';
import { CurrencyController } from './controller/currency.controller';
import { CurrencyService } from './service/currency.service';
import { CurrencyRepository } from './repository/currency.repository';
import { Config } from './config/config';

export class Application {
  private readonly routes: Routes;

  private constructor(
    private readonly app: express.Express,
    private readonly server: Server
  ) {
    this.routes = new Routes(
      new CurrencyController(
        new CurrencyService(new CurrencyRepository(new Config()))
      )
    );
    const currencyRouter = this.routes.registerCurrencyRoutes();
    app.use('/api', currencyRouter);
  }

  public static async start(): Promise<Application> {
    const app = express();

    app.use('/assets', express.static(path.join(__dirname, 'assets')));

    const port = process.env['PORT'] || 3333;
    const server = app.listen(port, () => {
      console.log(`Listening at http://localhost:${port}/api`);
    });
    server.on('error', console.error);

    return new Application(app, server);
  }

  public async stop(): Promise<void> {
    this.server.close();
  }
}
