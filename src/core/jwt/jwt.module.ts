import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AccessTokenStrategy } from './accessToken.strategy';
import { JwtTokenService } from './jwt.service';
import { UserRepositoryModule } from 'src/modules/user/repository/user-repository.module';

@Module({
  imports: [JwtModule.register({}), UserRepositoryModule],
  providers: [JwtTokenService, AccessTokenStrategy],
  exports: [JwtTokenService],
})
export class JWTModule {}
