import { QuoteTargetCurrency } from 'src/entities/quote/quote.interface';
import { IQuoteStrategy } from './quete.strategy.interface';
import { JpyQuoteCalculatorStrategy } from './jpyQuote.strategy';
import { UsdQuoteCalculatorStrategy } from './usdQuote.strategy';
import { Injectable, UnprocessableEntityException } from '@nestjs/common';

@Injectable()
export class QuoteStrategyFactory {
  constructor(
    private readonly jpyQuoteCalculator: JpyQuoteCalculatorStrategy,
    private readonly usdQuoteCalculator: UsdQuoteCalculatorStrategy,
  ) {}

  getQuoteStrategy(currency: QuoteTargetCurrency): IQuoteStrategy {
    switch (currency) {
      case QuoteTargetCurrency.Jpy:
        return this.jpyQuoteCalculator;
      case QuoteTargetCurrency.Usd:
        return this.usdQuoteCalculator;
      default:
        throw new UnprocessableEntityException(
          `Unsupported target currency: ${currency}`,
        );
    }
  }
}
