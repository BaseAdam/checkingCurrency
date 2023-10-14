import { Request, Response } from 'express';
import { CurrencyService } from '../service/currency.service';

export class CurrencyController {
  private readonly currencyService: CurrencyService;

  constructor() {
    this.currencyService = new CurrencyService();
  }

  public async getRandom(req: Request, res: Response): Promise<void> {
    const random = await this.currencyService.getRandom();
    res.status(200).send(random);
  }
}
