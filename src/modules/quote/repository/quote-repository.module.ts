import { Module } from '@nestjs/common';
import { TypeOrmExModule } from 'libs/common/typeorm.ex/typeorm-ex.module';
import { QuoteRepository } from './quote.repository';

@Module({
  imports: [TypeOrmExModule.forCustomRepository([QuoteRepository])],
  exports: [TypeOrmExModule.forCustomRepository([QuoteRepository])],
})
export class QuoteRepositoryModule {}
