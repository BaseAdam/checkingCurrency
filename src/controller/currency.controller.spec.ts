import { CurrencyService } from '../service/currency.service';
import { CurrencyController } from './currency.controller';
import { instance, mock, when } from 'ts-mockito';
import { Currency, ExchangeRate } from '../repository/currency.repository';
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
    req = {
      params: { currency: 'USD' },
    } as unknown as Request;
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

  it('send currencies as a HTTP response', async () => {
    //given
    const mainCurrency = 'USD';
    const exchangeRate: ExchangeRate = [
      mainCurrency,
      {
        rates: {
          [Currency.PLN]: 2.31,
          [Currency.EUR]: 2.31,
          [Currency.CHF]: 2.31,
          [Currency.USD]: 0,
          [Currency.GBP]: 1.23,
        },
      },
    ];
    when(currencyServiceMock.getCurrencyChangeRate(mainCurrency)).thenResolve(exchangeRate);

    //when
    await currencyController.getCurrencyChangeRate(req, res);

    //then
    expect(res.send).toHaveBeenCalledWith(exchangeRate);
  });
});
