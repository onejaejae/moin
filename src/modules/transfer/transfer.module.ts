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
import { TransferRepositoryModule } from './repository/transfer-repository.module';
import { RequestTransferPolicy } from './policy/requestTransfer.policy';
import { UserRepositoryModule } from '../user/repository/user-repository.module';

@Module({
  imports: [
    QuoteRepositoryModule,
    TransferRepositoryModule,
    UserRepositoryModule,
  ],
  controllers: [TransferController],
  providers: [
    TransferService,
    FeeService,
    ExchangeRateService,
    AmountCalculatorService,
    QuoteStrategyFactory,
    JpyQuoteCalculatorStrategy,
    UsdQuoteCalculatorStrategy,
    RequestTransferPolicy,
  ],
})
export class TransferModule {}
