import { JwtModule } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { JWT_SECRET, JWT_TOKEN_EXPIRY } from '../config/common';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';
import { RefreshTokenEntity } from './refresh-token.entity';

describe('AuthService', () => {
  let service: AuthService;

  const mockUsersService = {
    createUser: jest.fn((dto) => {
      return {
        id: 1,
        ...dto,
      };
    }),
    updateUser: jest.fn((id, dto) => {
      return {
        id,
        ...dto,
      };
    }),
    getAllUsers: jest.fn(() => []),
    getUserById: jest.fn((id) => ({
      id,
      email: 'test@test.com',
      username: 'admin',
    })),
    deleteUser: jest.fn((id) => ({
      id,
      email: 'test@test.com',
      username: 'admin',
    })),
  };

  const mockRefreshTokenRepository = {
    save: jest.fn().mockImplementation((dto) => ({ ...dto })),
    count: jest.fn().mockImplementation((_) => 0),
    findOneOrFail: jest.fn().mockImplementation((userId) => ({
      userId,
      token: 'ageage',
      expiry: new Date(),
    })),
    find: jest.fn().mockImplementation(() => []),
    remove: jest.fn().mockImplementation((user) => user),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        JwtModule.register({
          secret: JWT_SECRET,
          signOptions: { expiresIn: JWT_TOKEN_EXPIRY },
        }),
      ],
      providers: [
        AuthService,
        { provide: UsersService, useValue: mockUsersService },
        {
          provide: getRepositoryToken(RefreshTokenEntity),
          useValue: mockRefreshTokenRepository,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
