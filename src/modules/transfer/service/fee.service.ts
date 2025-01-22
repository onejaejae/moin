import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { QuoteTargetCurrency } from 'src/entities/quote/quote.interface';

interface FeeConfig {
  fixedFee: number;
  feeRate: number;
  amountRange: {
    min: number;
    max: number;
  };
}

@Injectable()
export class FeeService {
  private readonly feeConfigs = {
    [QuoteTargetCurrency.Usd]: [
      {
        fixedFee: 1000,
        feeRate: 0.002,
        amountRange: {
          min: 1,
          max: 1000000,
        },
      },
      {
        fixedFee: 3000,
        feeRate: 0.001,
        amountRange: {
          min: 1000001,
          max: Infinity,
        },
      },
    ],
    [QuoteTargetCurrency.Jpy]: [
      {
        fixedFee: 3000,
        feeRate: 0.005,
        amountRange: {
          min: 1,
          max: Infinity,
        },
      },
    ],
  };

  private getFeeConfigForAmount(
    amount: number,
    configs: FeeConfig[],
  ): FeeConfig {
    const config = configs.find(
      (config) =>
        amount >= config.amountRange.min && amount <= config.amountRange.max,
    );

    if (!config) throw new UnprocessableEntityException('INVALID_AMOUNT');

    return config;
  }

  private calculateBasicFee(amount: number, config: FeeConfig): number {
    return amount * config.feeRate + config.fixedFee;
  }

  calculateFee(amount: number, currency: QuoteTargetCurrency): number {
    const configs = this.feeConfigs[currency];
    const config = this.getFeeConfigForAmount(amount, configs);
    return this.calculateBasicFee(amount, config);
  }
}
