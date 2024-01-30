import { Collection, MongoClient } from 'mongodb';

export class MongoDatabase {
  private constructor(private readonly client: MongoClient) {}

  public static async connect(uri: string): Promise<MongoDatabase> {
    const client = new MongoClient(uri);
    await client.connect();
    return new MongoDatabase(client);
  }

  public getCollection(name: string): Collection {
    return this.client.db('CurrenciesDB').collection(name);
  }

  public async stop(): Promise<void> {
    await this.client.close();
  }
}
