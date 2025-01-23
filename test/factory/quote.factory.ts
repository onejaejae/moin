import { Quote } from 'src/entities/quote/quote.entity';
import { QuoteTargetCurrency } from 'src/entities/quote/quote.interface';
import { User } from 'src/entities/user/user.entity';
import { QuoteRepository } from 'src/modules/quote/repository/quote.repository';

export class QuoteFactory {
  static async createQuote(
    userId: User['id'],
    usdAmount: Quote['usdAmount'],
    expiredAt: Quote['expiredAt'],
    quoteRepository: QuoteRepository,
  ) {
    const quote = quoteRepository.create({
      userId,
      targetCurrency: QuoteTargetCurrency.Usd,
      sourceAmount: 1000,
      fee: 100,
      usdExchangeRate: 1000,
      usdAmount,
      exchangeRate: 1000,
      targetAmount: 1000,
      expiredAt,
    });

    return quoteRepository.save(quote);
  }
}
