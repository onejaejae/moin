import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppConfig, Configurations, DBConfig, JwtConfig } from '.';

@Injectable()
export class MoinConfigService {
  constructor(private readonly configService: ConfigService<Configurations>) {}

  getAppConfig(): AppConfig {
    return this.configService.getOrThrow('APP');
  }

  getDBConfig(): DBConfig {
    return this.configService.getOrThrow('DB');
  }

  getJwtConfig(): JwtConfig {
    return this.configService.getOrThrow('JWT');
  }
}
