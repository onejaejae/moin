import {
  BadRequestException,
  ConflictException,
  INestApplication,
  NotFoundException,
} from '@nestjs/common';
import { CoreModule } from 'src/core/core.module';
import { UserRepository } from '../user/repository/user.repository';
import { AuthService } from './auth.service';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthModule } from './auth.module';
import { initializeTransactionalContext } from 'typeorm-transactional';
import { SignUpBody } from './dto/req/signUp.body';
import { SignInBody } from './dto/req/signIn.body';
import { IdType } from 'src/entities/user/user.interface';
import { plainToInstance } from 'class-transformer';
import { UserFactory } from 'test/factory/user.factory';
import { Encrypt } from 'libs/util/encrypt';

let app: INestApplication;
let service: AuthService;
let userRepository: UserRepository;

beforeAll(async () => {
  initializeTransactionalContext();

  const module: TestingModule = await Test.createTestingModule({
    imports: [CoreModule, AuthModule],
  }).compile();

  app = module.createNestApplication();
  await app.init();

  userRepository = module.get<UserRepository>(UserRepository);

  service = module.get<AuthService>(AuthService);
});

describe('AuthService', () => {
  afterAll(async () => {
    await app.close();
  });

  beforeEach(async () => {
    await userRepository.deleteAllForTest();
  });

  describe('signUp', () => {
    it('회원가입 API 정상 동작합니다. - 비밀번호, idValue는 암호화되어 저장됩니다.', async () => {
      // given
      const plainBody: Partial<SignUpBody> = {
        userId: 'test@example.com',
        password: 'password123',
        name: 'test',
        idType: IdType.BusinessNo,
        idValue: '123-12-12345',
      };
      const dto = plainToInstance(SignUpBody, plainBody);

      // when
      const user = await service.signUp(dto);

      // then;
      expect(user).toBeDefined();
      expect(user.userId).toBe(dto.userId);
      expect(user.name).toBe(dto.name);
      expect(user.password).not.toBe(dto.password);
      expect(user.idType).toBe(dto.idType);
      expect(user.idValue).not.toBe(dto.idValue);
    });

    it('이미 존재하는 이메일로 가입 시도시 에러가 발생합니다.', async () => {
      // given
      const existUserId = 'test@example.com';
      await UserFactory.createUser(
        existUserId,
        'password123',
        'test',
        IdType.BusinessNo,
        '123-12-12345',
        userRepository,
      );

      const plainBody: Partial<SignUpBody> = {
        userId: existUserId,
        password: 'password123',
        name: 'test',
        idType: IdType.BusinessNo,
        idValue: '123-12-12345',
      };
      const dto = plainToInstance(SignUpBody, plainBody);

      // when
      // then
      await expect(service.signUp(dto)).rejects.toThrow(
        new ConflictException('이미 존재하는 userId입니다.'),
      );
    });
  });

  describe('signIn', () => {
    it('로그인 API 정상 동작합니다.', async () => {
      // given
      const plainPassword = 'password123';
      const hashedPassword = await Encrypt.createHash(plainPassword);

      const user = await UserFactory.createUser(
        'test@test.com',
        hashedPassword,
        'test',
        IdType.BusinessNo,
        '123-12-12345',
        userRepository,
      );

      const plainBody: Partial<SignInBody> = {
        userId: user.userId,
        password: plainPassword,
      };
      const dto = plainToInstance(SignInBody, plainBody);

      // when
      const result = await service.signIn(dto);

      // then
      expect(result).toBeDefined();
    });

    it('잘못된 비밀번호로 로그인 시도시 에러가 발생합니다.', async () => {
      // given
      const user = await UserFactory.createUser(
        'test@test.com',
        'password123',
        'test',
        IdType.BusinessNo,
        '123-12-12345',
        userRepository,
      );

      const plainBody: Partial<SignInBody> = {
        userId: user.userId,
        password: 'wrongpassword',
      };
      const dto = plainToInstance(SignInBody, plainBody);

      // when
      // then
      await expect(service.signIn(dto)).rejects.toThrow(
        new BadRequestException('비밀번호가 일치하지 않습니다.'),
      );
    });

    it('존재하지 않는 이메일로 로그인 시도시 에러가 발생합니다.', async () => {
      // given
      const plainBody: Partial<SignInBody> = {
        userId: 'wrong@test.com',
        password: 'wrongpassword',
      };
      const dto = plainToInstance(SignInBody, plainBody);

      // then
      await expect(service.signIn(dto)).rejects.toThrow(
        new NotFoundException(`don't exist userId: ${dto.userId}`),
      );
    });
  });
});
