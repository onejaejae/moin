import { Module } from '@nestjs/common';
import { TransferController } from './transfer.controller';
import { TransferService } from './service/transfer.service';
import { AmountCalculatorService } from './service/amount-calculator.service';
import { ExchangeRateService } from './service/exchange-rate.service';
import { FeeService } from './service/fee.service';
import { QuoteRepositoryModule } from '../quote/repository/quote-repository.module';
import { JpyQuoteCalculatorStrategy } from './strategy/jpyQuote.strategy';
import { QuoteStrategyFactory } from './strategy/quote.strategy.factory';
import { UsdQuoteCalculatorStrategy } from './strategy/usdQuote.strategy';

@Module({
  imports: [QuoteRepositoryModule],
  controllers: [TransferController],
  providers: [
    TransferService,
    FeeService,
    ExchangeRateService,
    AmountCalculatorService,
    QuoteStrategyFactory,
    JpyQuoteCalculatorStrategy,
    UsdQuoteCalculatorStrategy,
  ],
})
export class TransferModule {}
