import { NextFunction, Request, Response } from 'express';
import { IncomingHttpHeaders } from 'http';
import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { Currency, supportedCurrencies } from '../types/currencies';
import { CurrencyEntity } from '../repository/currency.repository';
import { Collection } from 'mongodb';

export type ValidationMiddlewareFunc = (data: {
  body: unknown;
  params: Record<string, unknown>;
  headers: IncomingHttpHeaders;
  query: Record<string, unknown>;
}) => void;

export type CurrencyExternalApiResponse = { conversion_rates: Record<string, number> };

@injectable()
export class ValidationMiddlewareFactory {
  public getMiddleware(validate: ValidationMiddlewareFunc) {
    return (req: Request, res: Response, next: NextFunction): void | Error => {
      try {
        validate({
          body: req.body,
          params: req.params,
          headers: req.headers,
          query: req.query,
        });
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        res.status(400).send(errorMessage);
        return;
      }

      next();
    };
  }
}

@injectable()
export class CurrencyUpdateMiddleware {
  constructor(
    @inject('CURRENCY_API_KEY') private readonly apiKey: string,
    @inject('CollectionCurrency') private readonly collection: Collection<CurrencyEntity>,
  ) {}

  private async fetchLatestRates(baseCurrency: Currency): Promise<CurrencyEntity> {
    const response = await fetch(`https://v6.exchangerate-api.com/v6/${this.apiKey}/latest/${baseCurrency}`);

    if (!response.ok) {
      throw new Error(`Failed to fetch exchange rates: ${response.statusText}`);
    }

    const data: CurrencyExternalApiResponse = (await response.json()) as CurrencyExternalApiResponse;
    return {
      name: baseCurrency,
      rates: data.conversion_rates,
      lastUpdated: new Date(),
    };
  }

  private needsUpdate(lastUpdated: Date): boolean {
    const oneDay = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
    const now = new Date();
    return !lastUpdated || now.getTime() - lastUpdated.getTime() > oneDay;
  }

  public async updateCurrencyRates(baseCurrency?: Currency): Promise<void> {
    try {
      if (baseCurrency) {
        // Update single currency
        await this.updateSingleCurrency(baseCurrency);
        return;
      }

      // Update all currencies
      const existingCurrencies = await this.collection.find().toArray();
      const existingMap = new Map(existingCurrencies.map((currency) => [currency.name, currency]));

      for (const currency of supportedCurrencies) {
        const existing = existingMap.get(currency);

        if (existing && !this.needsUpdate(existing.lastUpdated)) {
          continue; // Skip if less than 24 hours old
        }

        const latestRates = await this.fetchLatestRates(currency as Currency);
        await this.collection.updateOne({ name: currency }, { $set: latestRates }, { upsert: true });
      }
    } catch (error) {
      throw new Error(`Failed to update currency rates: ${error}`);
    }
  }

  private async updateSingleCurrency(currency: Currency): Promise<void> {
    const existing = await this.collection.findOne({ name: currency });

    if (existing && !this.needsUpdate(existing.lastUpdated)) {
      return; // Skip update if less than 24 hours old
    }

    const latestRates = await this.fetchLatestRates(currency);
    await this.collection.updateOne({ name: currency }, { $set: latestRates }, { upsert: true });
  }
}
