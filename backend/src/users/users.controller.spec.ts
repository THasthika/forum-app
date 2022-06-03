import { Test, TestingModule } from '@nestjs/testing';
import { randomUUID } from 'crypto';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

describe('UsersController', () => {
  let controller: UsersController;

  const mockUsersService = {
    createUser: jest.fn((dto) => {
      return {
        id: randomUUID(),
        ...dto,
      };
    }),
    updateUser: jest.fn((id, dto) => {
      return {
        id,
        ...dto,
      };
    }),
    findAllUsers: jest.fn(() => ({
      data: [],
    })),
    findUserById: jest.fn((id) => ({
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

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [UsersService],
    })
      .overrideProvider(UsersService)
      .useValue(mockUsersService)
      .compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a new user', () => {
    const dto = {
      email: 'admin@test.com',
      username: 'admin',
      password: 'admin1234',
    };
    expect(controller.createUser(dto)).toEqual({
      id: expect.any(String),
      ...dto,
    });
  });

  it('should update a user', () => {
    const dto = {
      email: 'admin12@test.com',
      username: 'admin123',
    };
    const uuid = randomUUID();
    expect(controller.updateUser(uuid, dto)).toEqual({
      id: uuid,
      ...dto,
    });
  });

  it('should find all users', async () => {
    const resp = await controller.findAllUsers({ path: '' });
    expect(resp).toHaveProperty('data', []);
  });

  it('should get user by id', () => {
    const uuid = randomUUID();
    expect(controller.findUserById(uuid)).toHaveProperty('id', uuid);
  });

  it('should delete user by id', () => {
    const uuid = randomUUID();
    expect(controller.deleteUser(uuid)).toHaveProperty('id', uuid);
  });
});
