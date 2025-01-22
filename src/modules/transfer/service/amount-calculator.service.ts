import { Injectable } from '@nestjs/common';
import { NegativeNumberException } from 'src/core/exception/negativeNumber.exception';
import { QuoteTargetCurrency } from 'src/entities/quote/quote.interface';

@Injectable()
export class AmountCalculatorService {
  constructor() {}

  private readonly currencyFractionDigits: Record<QuoteTargetCurrency, number> =
    {
      [QuoteTargetCurrency.Jpy]: 0,
      [QuoteTargetCurrency.Usd]: 2,
    };

  private roundAmount(amount: number, currency: QuoteTargetCurrency): number {
    const fractionDigits = this.currencyFractionDigits[currency];
    return Number(amount.toFixed(fractionDigits));
  }

  calculateTargetAmount(
    amount: number,
    fee: number,
    exchangeRate: number,
    targetCurrency: QuoteTargetCurrency,
  ): number {
    const rawAmount = (amount - fee) / exchangeRate;
    if (rawAmount < 0) throw new NegativeNumberException();

    return this.roundAmount(rawAmount, targetCurrency);
  }
}
