import { Module } from '@nestjs/common';
import { TypeOrmExModule } from 'libs/common/typeorm.ex/typeorm-ex.module';
import { TransferRepository } from './transfer.repository';

@Module({
  imports: [TypeOrmExModule.forCustomRepository([TransferRepository])],
  exports: [TypeOrmExModule.forCustomRepository([TransferRepository])],
})
export class TransferRepositoryModule {}
