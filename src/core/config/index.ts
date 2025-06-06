export enum Env {
  test = 'test',
  local = 'local',
  dev = 'dev',
  prod = 'prod',
}

export interface AppConfig {
  PORT: string | number;
  BASE_URL: string;
  NODE_ENV: string;
  ENV: Env;
}

export interface DBConfig {
  DB_HOST: string;
  DB_USER_NAME: string;
  DB_PASSWORD: string;
  DB_DATABASE: string;
  DB_PORT: number | string;
}

export interface JwtConfig {
  JWT_SECRET: string;
  JWT_ACCESS_TOKEN_EXPIRES_IN: string;
  JWT_REFRESH_TOKEN_EXPIRES_IN: string;
}

export interface Configurations {
  APP: AppConfig;
  DB: DBConfig;
  JWT: JwtConfig;
}
