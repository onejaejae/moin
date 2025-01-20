import { User } from 'src/entities/user/user.entity';

export interface IAccessTokenPayload {
  sub: User['id'];
}
