import express from 'express';
import { Server } from 'http';
import * as path from 'path';
import { router, Routes } from './routes/routes';

export class Application {
    private readonly routes: Routes  

  private constructor(
    private readonly app: express.Express,
    private readonly server: Server
  ) {
      this.routes = new Routes()
      this.routes.registerRoutes()
      app.use("/api", router)
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

