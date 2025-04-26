import { Currency } from './currencies';

export type ExchangeRate = { currency: Currency; exchangeRate: number };
export type ComparisonRate = { exchangeRate: number };
export type CurrencyEntity = { name: string; rates: Record<string, number> };
