import { Test, TestingModule } from '@nestjs/testing';
import axios from 'axios';
import { QuoteTargetCurrency } from 'src/entities/quote/quote.interface';
import { ExchangeRateService } from '../exchange-rate.service';

// axios mock 설정
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('ExchangeRateService', () => {
  let service: ExchangeRateService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ExchangeRateService],
    }).compile();

    service = module.get<ExchangeRateService>(ExchangeRateService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getExchangeRate', () => {
    it('USD 환율을 정상적으로 반환해야 합니다', async () => {
      // given
      const mockResponse = {
        data: [
          {
            basePrice: 1300.5, // KRW/USD 환율
            currencyUnit: 1,
          },
        ],
      };
      mockedAxios.get.mockResolvedValue(mockResponse);

      // when
      const result = await service.getExchangeRate(QuoteTargetCurrency.Usd);

      // then
      expect(result).toBe(1300.5);
      expect(mockedAxios.get).toHaveBeenCalledWith(
        'https://crix-api-cdn.upbit.com/v1/forex/recent',
        {
          params: {
            codes: `FRX.KRW${QuoteTargetCurrency.Usd}`,
          },
        },
      );
    });
  });
});
