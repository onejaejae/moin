import { CustomRepository } from 'libs/common/typeorm.ex/typeorm-ex.decorator';
import { GenericTypeOrmRepository } from 'src/core/database/typeorm/generic-typeorm.repository';
import { Transfer } from 'src/entities/transfer/transfer.entity';
import dayjs from 'dayjs';
import { Between } from 'typeorm';
import { User } from 'src/entities/user/user.entity';

@CustomRepository(Transfer)
export class TransferRepository extends GenericTypeOrmRepository<Transfer> {
  async findTodayTransfers(userId: User['id']) {
    const startOfDay = dayjs().startOf('day').toDate();
    const endOfDay = dayjs().endOf('day').toDate();

    return this.findManyWithOmitNotJoinedProps(
      {
        userId,
        createdAt: Between(startOfDay, endOfDay),
      },
      { Quote: true },
    );
  }
}
