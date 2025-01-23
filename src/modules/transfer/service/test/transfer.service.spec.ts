import { INestApplication, NotFoundException } from '@nestjs/common';
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
import { QuoteFactory } from 'test/factory/quote.factory';
import { TransferRepository } from '../../repository/transfer.repository';
import dayjs from 'dayjs';
import { LimitExcessException } from 'src/core/exception/limitExcess.exception';
import { QuoteExpiredException } from 'src/core/exception/quoteExpired.exception';
import { plainToInstance } from 'class-transformer';
import { QuoteTargetCurrency } from 'src/entities/quote/quote.interface';
import { CreateQuoteBody } from '../../dto/req/createQuote.body';
import { TransferFactory } from 'test/factory/transfer.factory';
import { v4 } from 'uuid';

let app: INestApplication;
let service: TransferService;
let userRepository: UserRepository;
let quoteRepository: QuoteRepository;
let transferRepository: TransferRepository;

beforeAll(async () => {
  initializeTransactionalContext();

  const module: TestingModule = await Test.createTestingModule({
    imports: [CoreModule, TransferModule, UserRepositoryModule],
  }).compile();

  app = module.createNestApplication();
  await app.init();

  userRepository = module.get<UserRepository>(UserRepository);
  quoteRepository = module.get<QuoteRepository>(QuoteRepository);
  transferRepository = module.get<TransferRepository>(TransferRepository);

  service = module.get<TransferService>(TransferService);
});

describe('TransferService', () => {
  afterAll(async () => {
    await app.close();
  });

  beforeEach(async () => {
    await transferRepository.deleteAllForTest();
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

  describe('requestTransfer', () => {
    it('법인 회원 송금 접수 요청 API 정상 동작합니다.', async () => {
      // given
      const user = await UserFactory.createUser(
        'test@example.com',
        'password123',
        'test',
        IdType.BusinessNo,
        '123-12-12345',
        userRepository,
      );

      const quote = await QuoteFactory.createQuote(
        user.id,
        1000,
        dayjs().add(10, 'minute').toDate(),
        quoteRepository,
      );

      // when
      const result = await service.requestTransfer(
        user.id,
        user.idType,
        quote.id,
      );

      // then
      expect(result).toBeDefined();
      expect(result.userId).toBe(user.id);
      expect(result.quoteId).toBe(quote.id);
    });

    it('개인 회원 송금 접수 요청 API 정상 동작합니다.', async () => {
      // given
      const user = await UserFactory.createUser(
        'test@example.com',
        'password123',
        'test',
        IdType.RegNo,
        '123-12-12345',
        userRepository,
      );

      const quote = await QuoteFactory.createQuote(
        user.id,
        1000,
        dayjs().add(10, 'minute').toDate(),
        quoteRepository,
      );

      // when
      const result = await service.requestTransfer(
        user.id,
        user.idType,
        quote.id,
      );

      // then
      expect(result).toBeDefined();
      expect(result.userId).toBe(user.id);
      expect(result.quoteId).toBe(quote.id);
    });

    it('견적서의 만료시간이 지나면 QUOTE_EXPIRED 예외가 발생합니다.', async () => {
      // given
      const user = await UserFactory.createUser(
        'test@example.com',
        'password123',
        'test',
        IdType.RegNo,
        '123-12-12345',
        userRepository,
      );

      const quote = await QuoteFactory.createQuote(
        user.id,
        1000,
        dayjs().subtract(10, 'minute').toDate(),
        quoteRepository,
      );

      // when
      // then
      await expect(
        service.requestTransfer(user.id, user.idType, quote.id),
      ).rejects.toThrow(new QuoteExpiredException());
    });

    it('법인 회원 일일 이체 한도 $5000를 초과하면 LimitExcessException 예외가 발생합니다.', async () => {
      // given
      const user = await UserFactory.createUser(
        'test@example.com',
        'password123',
        'test',
        IdType.BusinessNo,
        '123-12-12345',
        userRepository,
      );

      const quote1 = await QuoteFactory.createQuote(
        user.id,
        3000,
        dayjs().add(10, 'minute').toDate(),
        quoteRepository,
      );
      const quote2 = await QuoteFactory.createQuote(
        user.id,
        3000,
        dayjs().add(10, 'minute').toDate(),
        quoteRepository,
      );
      const quote3 = await QuoteFactory.createQuote(
        user.id,
        3000,
        dayjs().add(10, 'minute').toDate(),
        quoteRepository,
      );

      await Promise.all([
        TransferFactory.createTransfer(user.id, quote1.id, transferRepository),
        TransferFactory.createTransfer(user.id, quote2.id, transferRepository),
      ]);

      // when
      // then
      await expect(
        service.requestTransfer(user.id, user.idType, quote3.id),
      ).rejects.toThrow(new LimitExcessException());
    });

    it('개인 회원 일일 이체 한도 $1000를 초과하면 LimitExcessException 예외가 발생합니다.', async () => {
      // given
      const user = await UserFactory.createUser(
        'test@example.com',
        'password123',
        'test',
        IdType.RegNo,
        '123-12-12345',
        userRepository,
      );

      const quote1 = await QuoteFactory.createQuote(
        user.id,
        500,
        dayjs().add(10, 'minute').toDate(),
        quoteRepository,
      );
      const quote2 = await QuoteFactory.createQuote(
        user.id,
        500,
        dayjs().add(10, 'minute').toDate(),
        quoteRepository,
      );
      const quote3 = await QuoteFactory.createQuote(
        user.id,
        500,
        dayjs().add(10, 'minute').toDate(),
        quoteRepository,
      );

      await Promise.all([
        TransferFactory.createTransfer(user.id, quote1.id, transferRepository),
        TransferFactory.createTransfer(user.id, quote2.id, transferRepository),
      ]);

      // when
      // then
      await expect(
        service.requestTransfer(user.id, user.idType, quote3.id),
      ).rejects.toThrow(new LimitExcessException());
    });
  });

  describe('getTransferList', () => {
    it('회원 거래 이력 조회 API 정상 동작합니다.', async () => {
      // given
      const user = await UserFactory.createUser(
        'test@example.com',
        'password123',
        'test',
        IdType.BusinessNo,
        '123-12-12345',
        userRepository,
      );

      const quote1 = await QuoteFactory.createQuote(
        user.id,
        3000,
        dayjs().add(10, 'minute').toDate(),
        quoteRepository,
      );
      const quote2 = await QuoteFactory.createQuote(
        user.id,
        3000,
        dayjs().add(10, 'minute').toDate(),
        quoteRepository,
      );
      const quote3 = await QuoteFactory.createQuote(
        user.id,
        3000,
        dayjs().add(10, 'minute').toDate(),
        quoteRepository,
      );

      await Promise.all([
        TransferFactory.createTransfer(user.id, quote1.id, transferRepository),
        TransferFactory.createTransfer(user.id, quote2.id, transferRepository),
        TransferFactory.createTransfer(user.id, quote3.id, transferRepository),
      ]);

      // when
      const result = await service.getTransferList(user.id);

      // then
      expect(result).toBeDefined();
      expect(result.id).toBe(user.id);
      expect(result.Transfers.length).toBe(3);
    });

    it('존재하지 않는 회원의 거래 이력을 조회하면 NotFoundException 예외가 발생합니다.', async () => {
      // given
      const userId = v4();

      // when
      await expect(service.getTransferList(userId)).rejects.toThrow(
        new NotFoundException('Not found'),
      );
    });
  });
});
