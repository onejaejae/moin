import { plainToInstance } from 'class-transformer';
import { IsEmail, IsEnum, IsString } from 'class-validator';
import { Encrypt } from 'libs/util/encrypt';
import { User } from 'src/entities/user/user.entity';
import { IdType } from 'src/entities/user/user.interface';

export class SignUpBody {
  @IsEmail()
  userId: User['userId'];

  @IsString()
  password: User['password'];

  @IsString()
  name: User['name'];

  @IsEnum(IdType)
  idType: User['idType'];

  @IsString()
  idValue: User['idValue'];

  async toEntity(): Promise<User> {
    const hashedPassword = await Encrypt.createHash(this.password);
    const hashedIdValue = await Encrypt.createHash(this.idValue);

    return plainToInstance(User, {
      ...this,
      password: hashedPassword,
      idValue: hashedIdValue,
    });
  }
}
