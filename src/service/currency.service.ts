import { CurrencyRepository } from "../repository/currency.repository"

export class CurrencyService {
    private readonly currencyRepository: CurrencyRepository;

    constructor() {
        this.currencyRepository = new CurrencyRepository();
    }

    public async getCurrencyComparison(currency: String, currencyToCompare: String): Promise<Object | undefined> {
        return this.currencyRepository.getCurrencyComparison(currency, currencyToCompare);
    }
}