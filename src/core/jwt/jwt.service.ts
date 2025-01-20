import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { MoinConfigService } from '../config/config.service';
import { IAccessTokenPayload } from './jwt.interface';
import { User } from 'src/entities/user/user.entity';

@Injectable()
export class JwtTokenService {
  private readonly accessTokenSecret: string;
  private readonly accessTokenExpiresIn: string;

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: MoinConfigService,
  ) {
    const jwtConfig = this.configService.getJwtConfig();
    this.accessTokenSecret = jwtConfig.JWT_SECRET;
    this.accessTokenExpiresIn = jwtConfig.JWT_ACCESS_TOKEN_EXPIRES_IN;
  }

  async accessTokenSignAsync(payload: IAccessTokenPayload) {
    return this.jwtService.signAsync(payload, {
      secret: this.accessTokenSecret,
      expiresIn: this.accessTokenExpiresIn,
    });
  }

  async generateTokens(sub: User['id']) {
    const accessTokenPayload: IAccessTokenPayload = {
      sub,
    };

    return this.accessTokenSignAsync(accessTokenPayload);
  }
}
