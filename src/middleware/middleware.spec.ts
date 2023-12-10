import { NextFunction, Request, Response } from 'express';
import { ValidationMiddleware, ValidationMiddlewareFunc } from './middleware';

describe('validation middleware - unit test', () => {
  let req: Request;
  let validationMiddleware: ValidationMiddleware;
  let mockValidate: ValidationMiddlewareFunc;
  let res: Response;
  let nextMock: NextFunction;

  beforeEach(() => {
    // res = {
    //   status: (_arg: number) => {
    //     return {
    //       send: (_body?: unknown): void => {},
    //     };
    //   },
    // } as unknown as Response;
    res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    } as unknown as Response;
    req = {} as Request;
    validationMiddleware = new ValidationMiddleware();
    nextMock = jest.fn();
    mockValidate = jest.fn();
  });

  afterEach(() => {
    // (mockValidate as jest.Mock<ValidationMiddlewareFunc>).mockClear();
    jest.clearAllMocks();
  });

  it('should call next() when validation succeeds', async () => {
    //when
    await validationMiddleware.getMiddleware(mockValidate)(req, res, nextMock);

    //then
    expect(nextMock).toHaveBeenCalled();
  });

  it('should send a 400 status when validation throws an error', async () => {
    //given
    const error = new Error('Validation error');
    (mockValidate as jest.Mock<ValidationMiddlewareFunc>).mockImplementationOnce(() => {
      throw error;
    });

    // when
    await validationMiddleware.getMiddleware(mockValidate)(req, res, nextMock);

    //then
    expect(nextMock).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.send).toHaveBeenCalledWith(error.message);
  });
});
