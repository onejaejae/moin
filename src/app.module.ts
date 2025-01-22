import { Module } from '@nestjs/common';
import { CoreModule } from './core/core.module';
import { AuthModule } from './modules/auth/auth.module';
import { TransferModule } from './modules/transfer/transfer.module';

const applicationModules = [AuthModule, TransferModule];

@Module({
  imports: [CoreModule, ...applicationModules],
})
export class AppModule {}
