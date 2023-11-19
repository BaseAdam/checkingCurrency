import { NextFunction, Request, Response } from 'express';
import { when, mock } from 'ts-mockito';
import { ValidationMiddleware } from './middleware';
import { validateCurrency } from '../repository/currency.repository';

describe('validation middleware - unit test', () => {
  let req: Request;
  let validationMiddleware: ValidationMiddleware;
  let res: Response;
  let next: NextFunction;

  beforeEach(() => {
    res = {
      status: jest.fn(() => res),
      send: jest.fn(),
    } as unknown as Response;
    next = jest.fn() as NextFunction;
    validationMiddleware = new ValidationMiddleware();
  });

  it('should call next() when validation succeeds', () => {
    //given
    req = {
      params: { currency: 'USD' },
    } as unknown as Request;
    const validateCurrencyMock = mock(validateCurrency);
    when(validationMiddleware.getMiddleware(validateCurrencyMock)).thenReturn(next);

    //when
    validationMiddleware.getMiddleware(validateCurrencyMock)(req, res, next);

    //then
    expect(next).toHaveBeenCalled();
  });

  it('should return status 400 and throw an error when the validation fails', () => {
    //given
    req = {
      params: { currency: 'Invalid currency' },
    } as unknown as Request;
    const validateCurrencyMock = mock(validateCurrency);
    when(validationMiddleware.getMiddleware(validateCurrencyMock)).thenThrow(new Error());

    //when
    validationMiddleware.getMiddleware(validateCurrencyMock)(req, res, next);

    //then
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.send).toHaveBeenCalledWith('Currency not found');
    expect(next).not.toHaveBeenCalled();
  });
});
