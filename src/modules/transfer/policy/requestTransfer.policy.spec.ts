import { Test } from '@nestjs/testing';
import { RequestTransferPolicy } from './requestTransfer.policy';
import { TransferRepository } from '../repository/transfer.repository';
import { IdType } from 'src/entities/user/user.interface';
import { LimitExcessException } from 'src/core/exception/limitExcess.exception';
import { mockDeep, MockProxy } from 'jest-mock-extended';

describe('RequestTransferPolicy', () => {
  let requestTransferPolicy: RequestTransferPolicy;
  let transferRepository: MockProxy<TransferRepository>;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [RequestTransferPolicy],
    })
      .useMocker(() => mockDeep<any>())
      .compile();

    requestTransferPolicy = moduleRef.get<RequestTransferPolicy>(
      RequestTransferPolicy,
    );
    transferRepository =
      moduleRef.get<MockProxy<TransferRepository>>(TransferRepository);
  });

  describe('validateDailyTransferLimit', () => {
    it('일반 사용자의 일일 송금 한도(1000 USD)를 초과하지 않으면 성공', async () => {
      // given
      const userId = 'user-1';
      const mockTransfers = [
        { Quote: { usdAmount: 500 } },
        { Quote: { usdAmount: 400 } },
      ];
      jest
        .spyOn(transferRepository, 'findTodayTransfers')
        .mockResolvedValue(mockTransfers as any);

      // when
      // then
      await expect(
        requestTransferPolicy.validateDailyTransferLimit(userId, IdType.RegNo),
      ).resolves.not.toThrow();
    });

    it('일반 사용자의 일일 송금 한도(1000 USD)를 초과하면 예외 발생', async () => {
      // given
      const userId = 'user-1';
      const mockTransfers = [
        { Quote: { usdAmount: 600 } },
        { Quote: { usdAmount: 500 } },
      ];
      jest
        .spyOn(transferRepository, 'findTodayTransfers')
        .mockResolvedValue(mockTransfers as any);

      // when
      // then
      await expect(
        requestTransferPolicy.validateDailyTransferLimit(userId, IdType.RegNo),
      ).rejects.toThrow(new LimitExcessException());
    });

    it('기업 사용자의 일일 송금 한도(5000 USD)를 초과하지 않으면 성공', async () => {
      // given
      const userId = 'business-1';
      const mockTransfers = [
        { Quote: { usdAmount: 2000 } },
        { Quote: { usdAmount: 2500 } },
      ];
      jest
        .spyOn(transferRepository, 'findTodayTransfers')
        .mockResolvedValue(mockTransfers as any);

      // when
      // then
      await expect(
        requestTransferPolicy.validateDailyTransferLimit(
          userId,
          IdType.BusinessNo,
        ),
      ).resolves.not.toThrow();
    });

    it('기업 사용자의 일일 송금 한도(5000 USD)를 초과하면 예외 발생', async () => {
      // given
      const userId = 'business-1';
      const mockTransfers = [
        { Quote: { usdAmount: 3000 } },
        { Quote: { usdAmount: 2500 } },
      ];
      jest
        .spyOn(transferRepository, 'findTodayTransfers')
        .mockResolvedValue(mockTransfers as any);

      // when
      // then
      await expect(
        requestTransferPolicy.validateDailyTransferLimit(
          userId,
          IdType.BusinessNo,
        ),
      ).rejects.toThrow(new LimitExcessException());
    });
  });
});
