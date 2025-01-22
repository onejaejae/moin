import { Injectable } from '@nestjs/common';
import { CreateQuoteBody } from '../dto/req/createQuote.body';
import { User } from 'src/entities/user/user.entity';
import { QuoteRepository } from 'src/modules/quote/repository/quote.repository';
import { Quote } from 'src/entities/quote/quote.entity';
import { QuoteStrategyFactory } from '../strategy/quote.strategy.factory';
import { QuoteExpiredException } from 'src/core/exception/quoteExpired.exception';
import { RequestTransferPolicy } from '../policy/requestTransfer.policy';
import { Transfer } from 'src/entities/transfer/transfer.entity';
import { TransferRepository } from '../repository/transfer.repository';

@Injectable()
export class TransferService {
  constructor(
    private readonly quoteStrategyFactory: QuoteStrategyFactory,
    private readonly requestTransferPolicy: RequestTransferPolicy,
    private readonly quoteRepository: QuoteRepository,
    private readonly transferRepository: TransferRepository,
  ) {}

  async createQuote(userId: User['id'], body: CreateQuoteBody) {
    const { amount, targetCurrency } = body;

    const strategy = this.quoteStrategyFactory.getQuoteStrategy(targetCurrency);
    const quoteData = await strategy.makeQuote(userId, amount);
    const quoteEntity = Quote.toEntity(quoteData);

    return this.quoteRepository.save(quoteEntity);
  }

  async requestTransfer(
    userId: User['id'],
    idType: User['idType'],
    quoteId: Quote['id'],
  ) {
    const quote = await this.quoteRepository.findByIdOrThrow(quoteId);

    // 견적서 만료 검증
    if (quote.isExpired()) throw new QuoteExpiredException();

    // 일일 이체 한도 검증
    await this.requestTransferPolicy.validateDailyTransferLimit(userId, idType);

    // 이체 요청
    const transferEntity = Transfer.toEntity({ userId, quoteId });
    return this.transferRepository.save(transferEntity);
  }
}
