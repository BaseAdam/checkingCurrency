import { NextFunction, Request, Response } from 'express';
import { ValidationMiddleware } from './middleware';

describe('validation middleware - unit test', () => {
  let req: Request;
  let validationMiddleware: ValidationMiddleware;
  let res: Response;
  let nextMock: NextFunction;

  beforeEach(() => {
    res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    } as unknown as Response;
    req = {} as Request;
    validationMiddleware = new ValidationMiddleware();
    nextMock = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call next() when validation succeeds', async () => {
    //when
    validationMiddleware.getMiddleware(jest.fn())(req, res, nextMock);

    //then
    expect(nextMock).toHaveBeenCalled();
  });

  it('should send a 400 status when validation throws an error', async () => {
    //given
    const error = new Error('Validation error');

    // when
    validationMiddleware.getMiddleware(() => {
      throw new Error('Validation error');
    })(req, res, nextMock);

    //then
    expect(nextMock).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.send).toHaveBeenCalledWith(error.message);
  });
});
