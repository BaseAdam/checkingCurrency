import { Application } from '../../../src/application';

export class TestApplication {
  constructor(private readonly app: Application) {}

  public static async start(): Promise<TestApplication> {
    const app = await Application.start();
    return new TestApplication(app);
  }

  public getBasePath(): string {
    return 'http://localhost:3333/api';
  }

  public async stop(): Promise<void> {
    await this.app.stop();
  }
}
