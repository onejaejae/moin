import { Test, TestingModule } from '@nestjs/testing';

import { QuoteTargetCurrency } from 'src/entities/quote/quote.interface';
import { NegativeNumberException } from 'src/core/exception/negativeNumber.exception';
import { AmountCalculatorService } from '../amount-calculator.service';

describe('AmountCalculatorService', () => {
  let service: AmountCalculatorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AmountCalculatorService],
    }).compile();

    service = module.get<AmountCalculatorService>(AmountCalculatorService);
  });

  describe('calculateTargetAmount', () => {
    it('JPY 통화에 대해 올바른 금액을 계산해야 한다', () => {
      // given
      const amount = 10000;
      const fee = 1000;
      const exchangeRate = 130;
      const targetCurrency = QuoteTargetCurrency.Jpy;

      // when
      const result = service.calculateTargetAmount(
        amount,
        fee,
        exchangeRate,
        targetCurrency,
      );

      // then
      expect(result).toBe(69); // (10000 - 1000) / 130 = 69.23... -> 69 (반올림)
    });

    it('USD 통화에 대해 올바른 금액을 계산해야 한다', () => {
      // given
      const amount = 10000;
      const fee = 1000;
      const exchangeRate = 1.3; // 1.2에서 1.3으로 변경
      const targetCurrency = QuoteTargetCurrency.Usd;

      // when
      const result = service.calculateTargetAmount(
        amount,
        fee,
        exchangeRate,
        targetCurrency,
      );

      // then
      expect(result).toBe(6923.08); // (10000 - 1000) / 1.3 = 6923.076923... -> 6923.08 (소수점 2자리 반올림)
    });

    it('음수가 계산될 경우 NegativeNumberException을 발생시켜야 한다', () => {
      // given
      const amount = 1000;
      const fee = 2000; // 금액보다 수수료가 더 큰 경우
      const exchangeRate = 1.2;
      const targetCurrency = QuoteTargetCurrency.Usd;

      // when
      // then
      expect(() =>
        service.calculateTargetAmount(
          amount,
          fee,
          exchangeRate,
          targetCurrency,
        ),
      ).toThrow(new NegativeNumberException());
    });
  });
});
