import cron from 'node-cron';
import { CurrencyService } from '../service/currency.service';
import { inject, injectable } from 'inversify';

@injectable()
export class Scheduler {
  constructor(@inject(CurrencyService) private currencyService: CurrencyService) {}

  public async fetchCurrencyRates(): Promise<void> {
    // Schedule a job to run every hour
    cron.schedule('0 * * * *', async () => {
      console.log('[Scheduler] Fetching latest exchange rates...');
      try {
        await this.currencyService.updateExchangeRates();
        console.log('[Scheduler] Done!');
      } catch (err) {
        console.error('[Scheduler] Failed to update rates:', err);
      }
    });
  }
}
