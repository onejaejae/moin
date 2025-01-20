import { Request as ExpressRequest } from 'express';
import { User } from 'src/entities/user/user.entity';

declare module 'express' {
  interface Request {
    user?: User;
  }
}

export type Request = ExpressRequest;
