import { INestApplication } from '@nestjs/common';
import { CoreModule } from 'src/core/core.module';
import { Test, TestingModule } from '@nestjs/testing';
import { initializeTransactionalContext } from 'typeorm-transactional';
import { TransferService } from '../transfer.service';
import { QuoteRepository } from 'src/modules/quote/repository/quote.repository';
import { TransferModule } from '../../transfer.module';
import { UserRepositoryModule } from 'src/modules/user/repository/user-repository.module';
import { UserRepository } from 'src/modules/user/repository/user.repository';
import { UserFactory } from 'test/factory/user.factory';
import { IdType } from 'src/entities/user/user.interface';
import { QuoteTargetCurrency } from 'src/entities/quote/quote.interface';
import { plainToInstance } from 'class-transformer';
import { CreateQuoteBody } from '../../dto/req/createQuote.body';

let app: INestApplication;
let service: TransferService;
let userRepository: UserRepository;
let quoteRepository: QuoteRepository;

beforeAll(async () => {
  initializeTransactionalContext();

  const module: TestingModule = await Test.createTestingModule({
    imports: [CoreModule, TransferModule, UserRepositoryModule],
  }).compile();

  app = module.createNestApplication();
  await app.init();

  userRepository = module.get<UserRepository>(UserRepository);
  quoteRepository = module.get<QuoteRepository>(QuoteRepository);

  service = module.get<TransferService>(TransferService);
});

describe('TransferService', () => {
  afterAll(async () => {
    await app.close();
  });

  beforeEach(async () => {
    await quoteRepository.deleteAllForTest();
    await userRepository.deleteAllForTest();
  });

  describe('createQuote', () => {
    it('USD 견적서 생성 API 정상 동작합니다.', async () => {
      // given
      const user = await UserFactory.createUser(
        'test@example.com',
        'password123',
        'test',
        IdType.BusinessNo,
        '123-12-12345',
        userRepository,
      );

      const plainBody: Partial<CreateQuoteBody> = {
        amount: 1000000,
        targetCurrency: QuoteTargetCurrency.Usd,
      };
      const dto = plainToInstance(CreateQuoteBody, plainBody);

      // when
      const result = await service.createQuote(user.id, dto);

      // then
      expect(result).toBeDefined();
      expect(result.userId).toBe(user.id);
      expect(result.sourceAmount).toBe(dto.amount);
      expect(result.targetCurrency).toBe(dto.targetCurrency);
      expect(result.fee).toBe(3000);
      expect(result.usdExchangeRate).toBe(result.exchangeRate);
      expect(result.usdAmount).toBe(result.targetAmount);
      expect(result.expiredAt).toBeDefined();
    });

    it('JPY 견적서 생성 API 정상 동작합니다.', async () => {
      // given
      const user = await UserFactory.createUser(
        'test@example.com',
        'password123',
        'test',
        IdType.BusinessNo,
        '123-12-12345',
        userRepository,
      );

      const plainBody: Partial<CreateQuoteBody> = {
        amount: 1000000,
        targetCurrency: QuoteTargetCurrency.Jpy,
      };
      const dto = plainToInstance(CreateQuoteBody, plainBody);

      // when
      const result = await service.createQuote(user.id, dto);

      // then
      expect(result).toBeDefined();
      expect(result.userId).toBe(user.id);
      expect(result.sourceAmount).toBe(dto.amount);
      expect(result.targetCurrency).toBe(dto.targetCurrency);
      expect(result.fee).toBe(8000);
      expect(result.usdExchangeRate).not.toBe(result.exchangeRate);
      expect(result.usdAmount).not.toBe(result.targetAmount);
      expect(result.expiredAt).toBeDefined();
    });
  });
});
