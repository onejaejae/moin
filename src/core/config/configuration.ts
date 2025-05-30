import { Configurations, Env } from './index';

export const configurations = (): Configurations => {
  const env = (process.env.NODE_ENV ?? Env.local) as Env;

  return {
    APP: {
      BASE_URL: process.env.BASE_URL || '',
      PORT: process.env.PORT || 3000,
      NODE_ENV: process.env.NODE_ENV || 'local',
      ENV: env,
    },
    DB: {
      DB_HOST: process.env.DB_HOST || '',
      DB_USER_NAME: process.env.DB_USER_NAME || '',
      DB_PASSWORD: process.env.DB_PASSWORD || '',
      DB_DATABASE: process.env.DB_DATABASE || '',
      DB_PORT: process.env.DB_PORT || 5432,
    },
    JWT: {
      JWT_SECRET: process.env.JWT_SECRET || '',
      JWT_ACCESS_TOKEN_EXPIRES_IN:
        process.env.JWT_ACCESS_TOKEN_EXPIRES_IN || '',
      JWT_REFRESH_TOKEN_EXPIRES_IN:
        process.env.JWT_REFRESH_TOKEN_EXPIRES_IN || '',
    },
  };
};
