import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
@Injectable()
export class AccessTokenGuard extends AuthGuard('jwt-access') {
  constructor() {
    super();
  }

  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }

  handleRequest(err: any, user: any, error: Error) {
    if (error) throw new UnauthorizedException(error.message);
    if (!user) throw new UnauthorizedException('invalid token');

    return user;
  }
}
