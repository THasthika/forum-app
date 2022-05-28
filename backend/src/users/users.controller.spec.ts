import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

describe('UsersController', () => {
  let controller: UsersController;

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
    findAllUsers: jest.fn(() => []),
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
      id: expect.any(Number),
      ...dto,
    });
  });

  it('should update a user', () => {
    const dto = {
      email: 'admin12@test.com',
      username: 'admin123',
    };
    expect(controller.updateUser(1, dto)).toEqual({
      id: 1,
      ...dto,
    });
  });

  it('should find all users', () => {
    expect(controller.findAllUsers()).toEqual([]);
  });

  it('should get user by id', () => {
    expect(controller.findUserById(1)).toHaveProperty('id', 1);
  });

  it('should delete user by id', () => {
    expect(controller.deleteUser(1)).toHaveProperty('id', 1);
  });
});
