import { plainToInstance } from 'class-transformer';
import { User } from 'src/entities/user/user.entity';
import { UserRepository } from 'src/modules/user/repository/user.repository';

export class UserFactory {
  static async createUser(
    userId: User['userId'],
    password: User['password'],
    name: User['name'],
    idType: User['idType'],
    idValue: User['idValue'],
    userRepository: UserRepository,
  ): Promise<User> {
    const user = plainToInstance(User, {
      userId,
      password,
      name,
      idType,
      idValue,
    });

    return userRepository.save(user);
  }
}
