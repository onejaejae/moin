import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { QuoteTargetCurrency } from 'src/entities/quote/quote.interface';

@Injectable()
export class ExchangeRateService {
  private readonly EXCHANGE_RATE_API_URL =
    'https://crix-api-cdn.upbit.com/v1/forex/recent';

  async getExchangeRate(targetCurrency: QuoteTargetCurrency): Promise<number> {
    const response = await axios.get(this.EXCHANGE_RATE_API_URL, {
      params: {
        codes: `FRX.KRW${targetCurrency}`,
      },
    });

    const data = response.data[0];
    return data.basePrice / data.currencyUnit;
  }
}
