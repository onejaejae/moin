import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { MoinConfigService } from '../config/config.service';
import { IAccessTokenPayload } from './jwt.interface';
import { UserRepository } from 'src/modules/user/repository/user.repository';

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-access',
) {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly configService: MoinConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.getJwtConfig().JWT_SECRET,
      ignoreExpiration: false,
      passReqToCallback: true,
    });
  }

  async validate(jwtPayload: IAccessTokenPayload) {
    const user = await this.userRepository.findOneByFilters({
      id: jwtPayload.sub,
    });

    if (!user) {
      throw new UnauthorizedException('접근 오류');
    }
    return user;
  }
}
