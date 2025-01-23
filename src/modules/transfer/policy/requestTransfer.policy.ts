import { Injectable } from '@nestjs/common';
import { User } from 'src/entities/user/user.entity';
import { TransferRepository } from '../repository/transfer.repository';
import { IdType } from 'src/entities/user/user.interface';
import { LimitExcessException } from 'src/core/exception/limitExcess.exception';
import { OmitNotJoinedProps } from 'src/core/database/typeorm/typeorm.interface';
import { Transfer } from 'src/entities/transfer/transfer.entity';

@Injectable()
export class RequestTransferPolicy {
  private readonly DAILY_USD_LIMITS = {
    [IdType.RegNo]: 1000,
    [IdType.BusinessNo]: 5000,
  } as const;

  constructor(private readonly transferRepository: TransferRepository) {}

  async validateDailyTransferLimit(userId: User['id'], idType: User['idType']) {
    const todayTransfers =
      await this.transferRepository.findTodayTransfers(userId);
    const totalUsdAmount = this.calculateTotalUsdAmount(todayTransfers);

    const limit = this.DAILY_USD_LIMITS[idType];
    if (totalUsdAmount >= limit) {
      throw new LimitExcessException();
    }
  }

  private calculateTotalUsdAmount(
    transfers: OmitNotJoinedProps<
      Transfer,
      {
        Quote: true;
      }
    >[],
  ): number {
    return transfers.reduce((acc, curr) => acc + curr.Quote.usdAmount, 0);
  }
}
