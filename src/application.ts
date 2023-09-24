import express from 'express';
import { Server } from 'http';
import * as path from 'path';
import { CurrencyController } from './controller/currency.controller';


export class Application {
    private readonly CurrencyController: CurrencyController;

    
  private constructor(
    private readonly app: express.Express,
    private readonly server: Server
  ) {
    this.CurrencyController = new CurrencyController();
    this.app.get("/api/random", (req, res) => 
        this.CurrencyController.getRandom(req, res)
        );
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
}

