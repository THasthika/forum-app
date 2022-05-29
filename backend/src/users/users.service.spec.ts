import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { RolesService } from '../roles/roles.service';
import { User } from './user.entity';
import { UsersService } from './users.service';

describe('UsersService', () => {
  let service: UsersService;

  const mockUsersRepository = {
    save: jest.fn().mockImplementation((dto) => ({ id: 1, ...dto })),
    count: jest.fn().mockImplementation((_) => 0),
    findOneOrFail: jest.fn().mockImplementation((id) => ({
      id,
      email: 'admin@test.com',
      username: 'admin',
      password: 'test',
    })),
    find: jest.fn().mockImplementation(() => []),
    remove: jest.fn().mockImplementation((user) => user),
  };

  const mockRolesService = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUsersRepository,
        },
        {
          provide: RolesService,
          useValue: mockRolesService,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a new user', async () => {
    const dto = {
      email: 'admin@test.com',
      username: 'admin',
      password: 'admin1234',
    };
    expect(await service.createUser(dto)).toHaveProperty(
      'id',
      expect.any(Number),
    );
  });

  it('should update a user', async () => {
    const dto = {
      email: 'admin12@test.com',
      username: 'admin123',
    };
    expect(await service.updateUser(1, dto)).toHaveProperty(
      'id',
      expect.any(Number),
    );
  });

  it('should find all users', async () => {
    expect(await service.findAllUsers()).toEqual([]);
  });

  it('should get user by id', async () => {
    expect(await service.findUserById(1)).toHaveProperty('id', 1);
  });

  it('should delete user by id', async () => {
    expect(await service.deleteUser(1)).toHaveProperty('id', 1);
  });
});
