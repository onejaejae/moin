import { IsEmail, IsString } from 'class-validator';
import { Encrypt } from 'libs/util/encrypt';
import { User } from 'src/entities/user/user.entity';

export class SignInBody {
  @IsEmail()
  userId: User['userId'];

  @IsString()
  password: User['password'];

  validationPassword(hashedPassword: string) {
    return Encrypt.isSameAsHash(hashedPassword, this.password);
  }
}
