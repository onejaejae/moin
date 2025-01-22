import { Injectable } from '@nestjs/common';
import { CreateQuoteBody } from '../dto/req/createQuote.body';
import { User } from 'src/entities/user/user.entity';
import { QuoteRepository } from 'src/modules/quote/repository/quote.repository';
import { Quote } from 'src/entities/quote/quote.entity';
import { QuoteStrategyFactory } from '../strategy/quote.strategy.factory';

@Injectable()
export class TransferService {
  constructor(
    private readonly quoteStrategyFactory: QuoteStrategyFactory,
    private readonly quoteRepository: QuoteRepository,
  ) {}

  async createQuote(userId: User['id'], body: CreateQuoteBody) {
    const { amount, targetCurrency } = body;

    const strategy = this.quoteStrategyFactory.getQuoteStrategy(targetCurrency);
    const quoteData = await strategy.makeQuote(userId, amount);
    const quoteEntity = Quote.toEntity(quoteData);

    return this.quoteRepository.save(quoteEntity);
  }
}
