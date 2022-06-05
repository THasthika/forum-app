import {
  HttpException,
  Injectable,
  InternalServerErrorException,
  Logger,
  OnModuleInit,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityNotFoundError, FindOneOptions, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UserEntity } from './user.entity';

import { HASH_SALT_ROUNDS } from '../common/config/common';
import * as bcrypt from 'bcrypt';
import { UserAlreadyExistsException } from './exceptions/user-already-exists.exception';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserNotFoundException } from './exceptions/user-not-found.exception';
import { EmailAlreadyExistsException } from './exceptions/email-already-exists.exception';
import { UsernameAlreadyExistsException } from './exceptions/username-already-exists.exception';
import { RolesService } from '../roles/roles.service';
import { RoleNotFoundException } from './exceptions/role-not-found.exception';
import { paginate, Paginated, PaginateQuery } from 'nestjs-paginate';
import { IIsOwnerService } from 'src/common/interfaces/is-owner-service.interface';

@Injectable()
export class UsersService implements OnModuleInit, IIsOwnerService {
  private logger = new Logger(UsersService.name);

  constructor(
    private rolesService: RolesService,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  async onModuleInit() {
    setTimeout(async () => {
      await this.initAdminUser();
    }, 500);
    // await this.initAdminUser();
  }

  private async initAdminUser() {
    // create admin user if not found
    let adminUser = await this.userRepository.findOne(
      { username: 'admin' },
      { relations: ['roles'] },
    );
    if (!adminUser) {
      this.logger.log('Creating admin user...');
      adminUser = await this.createUser({
        email: 'admin@test.com',
        password: 'admin@1234',
        username: 'admin',
      });
      adminUser.isVerified = true;
    }
    if (!adminUser.roles) {
      adminUser.roles = [];
    }
    if (adminUser.roles.length === 0) {
      this.logger.log('Adding ADMIN role to admin user...');
      const adminRole = await this.rolesService.findRoleByName('ADMIN');
      if (!adminRole) {
        return;
      }
      adminUser.roles.push(adminRole);
      this.userRepository.save(adminUser);
    }
  }

  findAllUsers(query: PaginateQuery): Promise<Paginated<UserEntity>> {
    return paginate(query, this.userRepository, {
      sortableColumns: ['id', 'email', 'username', 'createdAt', 'updatedAt'],
      searchableColumns: ['id', 'email', 'username', 'isBanned', 'isVerified'],
      defaultSortBy: [['updatedAt', 'DESC']],
      defaultLimit: 50,
    });
  }

  findUserById(id: string, options: FindOneOptions<UserEntity> = {}) {
    try {
      return this.userRepository.findOneOrFail(id, options);
    } catch (err) {
      if (err instanceof EntityNotFoundError) {
        throw new UserNotFoundException();
      }
      throw err;
    }
  }

  async findUserByEmail(email: string): Promise<UserEntity | undefined> {
    return await this.userRepository.findOne({
      where: { email },
    });
  }

  async createUser(createUserDto: CreateUserDto): Promise<UserEntity> {
    const user = new UserEntity();
    user.email = createUserDto.email;
    user.username = createUserDto.username;
    user.isVerified = true;
    user.password = await this.hashPassword(createUserDto.password);
    try {
      // check if email already exists in the system
      const emailUserCount = await this.userRepository.count({
        where: { email: user.email },
      });
      if (emailUserCount > 0) {
        throw new EmailAlreadyExistsException();
      }

      // check if username already exists in the system
      const usernameUserCount = await this.userRepository.count({
        where: { username: user.username },
      });
      if (usernameUserCount > 0) {
        throw new UsernameAlreadyExistsException();
      }

      const cuser = await this.userRepository.save(user);
      await this.addRole(cuser.id, 'USER');

      return cuser;
    } catch (err) {
      if (err instanceof HttpException) {
        throw err;
      }
      if (err.driverError && err.driverError.code === '23505') {
        throw new UserAlreadyExistsException();
      }
      throw new InternalServerErrorException();
    }
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto) {
    try {
      const user = await this.userRepository.findOneOrFail(id);
      if (!!updateUserDto.email) {
        user.email = updateUserDto.email;
      }
      if (!!updateUserDto.username) {
        user.username = updateUserDto.username;
      }
      return await this.userRepository.save(user);
    } catch (err) {
      if (err instanceof EntityNotFoundError) {
        throw new UserNotFoundException();
      }
      throw err;
    }
  }

  async deleteUser(id: string) {
    try {
      const user = await this.userRepository.findOneOrFail(id);
      return await this.userRepository.remove(user);
    } catch (err) {
      if (err instanceof EntityNotFoundError) {
        throw new UserNotFoundException();
      }
      throw err;
    }
  }

  async addRole(id: string, roleName: string) {
    const role = await this.rolesService.findRoleByName(roleName);
    if (!role) {
      throw new RoleNotFoundException();
    }

    let user = await this.userRepository.findOne(id, {
      relations: ['roles'],
    });
    if (!user) {
      throw new UserNotFoundException();
    }

    if (user.roles.some((v) => v.name === role.name)) {
      return user;
    }

    user.roles.push(role);
    user = await this.userRepository.save(user);

    return user;
  }

  async removeRole(id: string, roleName: string) {
    const role = await this.rolesService.findRoleByName(roleName);
    if (!role) {
      throw new RoleNotFoundException();
    }

    let user = await this.userRepository.findOne(id, {
      relations: ['roles'],
    });
    if (!user) {
      throw new UserNotFoundException();
    }

    if (!user.roles.some((v) => v.name === role.name)) {
      return user;
    }

    const newRoles = user.roles.filter((v) => v.name !== role.name);
    user.roles = newRoles;
    user = await this.userRepository.save(user);

    return user;
  }

  async isOwner(id: string, userId: string) {
    return id === userId;
  }

  private async hashPassword(password: string) {
    const salt = await bcrypt.genSalt(HASH_SALT_ROUNDS);
    return await bcrypt.hash(password, salt);
  }
}
