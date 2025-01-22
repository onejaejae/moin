import { Test, TestingModule } from '@nestjs/testing';
import { UnprocessableEntityException } from '@nestjs/common';
import { QuoteTargetCurrency } from 'src/entities/quote/quote.interface';
import { FeeService } from '../fee.service';

describe('FeeService', () => {
  let service: FeeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FeeService],
    }).compile();

    service = module.get<FeeService>(FeeService);
  });

  describe('calculateFee', () => {
    describe('USD 수수료 계산', () => {
      it('1,000,000 USD 이하일 때 수수료를 정확히 계산해야 함', () => {
        const amount = 500000;
        const fee = service.calculateFee(amount, QuoteTargetCurrency.Usd);
        // 예상 수수료: (500,000 * 0.002) + 1000 = 2000
        expect(fee).toBe(2000);
      });

      it('1,000,000 USD 초과일 때 수수료를 정확히 계산해야 함', () => {
        const amount = 2000000;
        const fee = service.calculateFee(amount, QuoteTargetCurrency.Usd);
        // 예상 수수료: (2000000 * 0.001) + 3000 = 5000
        expect(fee).toBe(5000);
      });

      it('최소 금액(1 USD) 미만일 때 예외를 발생시켜야 함', () => {
        const amount = 0;
        expect(() => {
          service.calculateFee(amount, QuoteTargetCurrency.Usd);
        }).toThrow(new UnprocessableEntityException('INVALID_AMOUNT'));
      });
    });

    describe('JPY 수수료 계산', () => {
      it('JPY 수수료를 정확히 계산해야 함', () => {
        const amount = 100000;
        const fee = service.calculateFee(amount, QuoteTargetCurrency.Jpy);
        // 예상 수수료: (100,000 * 0.005) + 3000 = 3500
        expect(fee).toBe(3500);
      });

      it('최소 금액(1 JPY) 미만일 때 예외를 발생시켜야 함', () => {
        const amount = 0;
        expect(() => {
          service.calculateFee(amount, QuoteTargetCurrency.Jpy);
        }).toThrow(new UnprocessableEntityException('INVALID_AMOUNT'));
      });
    });
  });
});
