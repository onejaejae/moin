import { Injectable } from '@nestjs/common';
import { Quote } from 'src/entities/quote/quote.entity';
import { QuoteTargetCurrency } from 'src/entities/quote/quote.interface';
import { AmountCalculatorService } from '../service/amount-calculator.service';
import { ExchangeRateService } from '../service/exchange-rate.service';
import { FeeService } from '../service/fee.service';
import { IQuoteStrategy } from './quete.strategy.interface';
import dayjs from 'dayjs';
@Injectable()
export class JpyQuoteCalculatorStrategy implements IQuoteStrategy {
  constructor(
    private readonly feeService: FeeService,
    private readonly exchangeRateService: ExchangeRateService,
    private readonly amountCalculatorService: AmountCalculatorService,
  ) {}

  async makeQuote(userId: string, amount: number): Promise<Partial<Quote>> {
    const jpyExchangeRate = await this.exchangeRateService.getExchangeRate(
      QuoteTargetCurrency.Jpy,
    );
    const jpyFee = this.feeService.calculateFee(
      amount,
      QuoteTargetCurrency.Jpy,
    );
    const jpyTargetAmount = this.amountCalculatorService.calculateTargetAmount(
      amount,
      jpyFee,
      jpyExchangeRate,
      QuoteTargetCurrency.Jpy,
    );

    const usdExchangeRate = await this.exchangeRateService.getExchangeRate(
      QuoteTargetCurrency.Usd,
    );
    const usdFee = this.feeService.calculateFee(
      amount,
      QuoteTargetCurrency.Usd,
    );
    const usdAmount = this.amountCalculatorService.calculateTargetAmount(
      amount,
      usdFee,
      usdExchangeRate,
      QuoteTargetCurrency.Usd,
    );

    return {
      userId,
      sourceAmount: amount,
      fee: jpyFee,
      usdExchangeRate,
      usdAmount,
      targetCurrency: QuoteTargetCurrency.Jpy,
      exchangeRate: jpyExchangeRate,
      targetAmount: jpyTargetAmount,
      expiredAt: dayjs().add(10, 'minute').toDate(),
    };
  }
}
