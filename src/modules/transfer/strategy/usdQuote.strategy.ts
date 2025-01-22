import { Injectable } from '@nestjs/common';
import { Quote } from 'src/entities/quote/quote.entity';
import { QuoteTargetCurrency } from 'src/entities/quote/quote.interface';
import { AmountCalculatorService } from '../service/amount-calculator.service';
import { ExchangeRateService } from '../service/exchange-rate.service';
import { FeeService } from '../service/fee.service';
import { IQuoteStrategy } from './quete.strategy.interface';
import dayjs from 'dayjs';

@Injectable()
export class UsdQuoteCalculatorStrategy implements IQuoteStrategy {
  constructor(
    private readonly feeService: FeeService,
    private readonly exchangeRateService: ExchangeRateService,
    private readonly amountCalculatorService: AmountCalculatorService,
  ) {}

  async makeQuote(userId: string, amount: number): Promise<Partial<Quote>> {
    const usdExchangeRate = await this.exchangeRateService.getExchangeRate(
      QuoteTargetCurrency.Usd,
    );
    const usdFee = this.feeService.calculateFee(
      amount,
      QuoteTargetCurrency.Usd,
    );
    const usdTargetAmount = this.amountCalculatorService.calculateTargetAmount(
      amount,
      usdFee,
      usdExchangeRate,
      QuoteTargetCurrency.Usd,
    );

    return {
      userId,
      sourceAmount: amount,
      fee: usdFee,
      usdExchangeRate,
      usdAmount: usdTargetAmount,
      targetCurrency: QuoteTargetCurrency.Usd,
      exchangeRate: usdExchangeRate,
      targetAmount: usdTargetAmount,
      expiredAt: dayjs().add(10, 'minute').toDate(),
    };
  }
}
