import { z } from 'zod';
import { ValidationMiddlewareFunc } from '../middleware/middleware';
import { Currency } from '../types/currencies';

export const currencySchema = z.nativeEnum(Currency);

export const validateCurrencyInQueryIfExists: ValidationMiddlewareFunc = ({ query }): void => {
  if (query.compare_to) {
    try {
      currencySchema.parse(query.compare_to);
    } catch (error) {
      throw new Error('Currency not found');
    }
  }
};

export const validateCurrency: ValidationMiddlewareFunc = ({ params }): void => {
  try {
    currencySchema.parse(params.currency);
  } catch (error) {
    throw new Error('Currency not found');
  }
};
