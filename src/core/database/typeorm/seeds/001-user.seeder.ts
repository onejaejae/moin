import { Encrypt } from 'libs/util/encrypt';
import { User } from 'src/entities/user/user.entity';
import { IdType } from 'src/entities/user/user.interface';
import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';

export default class UserSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<void> {
    const userRepository = dataSource.getRepository(User);

    const users: Partial<User>[] = [
      {
        userId: 'test@test.com',
        password: await Encrypt.createHash('test'),
        name: 'test',
        idType: IdType.BusinessNo,
        idValue: '1234567890',
      },
      {
        userId: 'test2@test.com',
        password: await Encrypt.createHash('test'),
        name: 'test2',
        idType: IdType.RegNo,
        idValue: '123-123-123',
      },
    ];

    // Create entity instances
    const userEntities = userRepository.create(users);

    // Save the created entities
    await userRepository.save(userEntities);
  }
}
