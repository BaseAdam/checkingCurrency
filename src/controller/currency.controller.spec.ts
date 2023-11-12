import { CurrencyService } from '../service/currency.service';
import { CurrencyController } from './currency.controller';
import { instance, mock, when } from 'ts-mockito';
import { Currency } from '../repository/currency.repository';
import { Request, Response } from 'express';

describe('currency controller - unit test', () => {
  let currencyController: CurrencyController;
  let currencyServiceMock: CurrencyService;
  let req: Request;
  let res: Response;

  beforeEach(() => {
    currencyServiceMock = mock(CurrencyService);
    res = {
      send: jest.fn(),
    } as unknown as Response;
    currencyController = new CurrencyController(instance(currencyServiceMock));
  });

  it('send currencies as a HTTP response', async () => {
    //given
    const testedCurrencies = [Currency.USD, Currency.PLN];
    when(currencyServiceMock.getAllCurrencies()).thenResolve(testedCurrencies);

    //when
    await currencyController.getAllCurrencies(req, res);

    //then
    expect(res.send).toHaveBeenCalledWith(testedCurrencies);
  });
});
