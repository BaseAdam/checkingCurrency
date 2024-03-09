import { Collection, Document, MongoClient } from 'mongodb';
import 'reflect-metadata';

export class MongoDatabase {
  private constructor(private readonly client: MongoClient) {}

  public static async start(uri: string): Promise<MongoDatabase> {
    const client = new MongoClient(uri);
    await client.connect();
    return new MongoDatabase(client);
  }

  public getCollection<T extends Document>(name: string): Collection<T> {
    return this.client.db('CurrenciesDB').collection<T>(name);
  }

  public async stop(): Promise<void> {
    await this.client.close();
  }
}
