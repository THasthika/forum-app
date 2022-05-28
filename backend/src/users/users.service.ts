import {
  HttpException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityNotFoundError, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './user.entity';

import { HASH_SALT_ROUNDS } from '../config/common';
import * as bcrypt from 'bcrypt';
import { UserAlreadyExistsException } from './exceptions/user-already-exists.exception';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserNotFoundException } from './exceptions/user-not-found.exception';
import { EmailAlreadyExistsException } from './exceptions/email-already-exists.exception';
import { UsernameAlreadyExistsException } from './exceptions/username-already-exists.exception';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  getAllUsers(): Promise<User[]> {
    return this.userRepository.find();
  }

  getUserById(id: number) {
    try {
      return this.userRepository.findOneOrFail(id);
    } catch (err) {
      if (err instanceof EntityNotFoundError) {
        throw new UserNotFoundException();
      }
      throw err;
    }
  }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const user = new User();
    user.email = createUserDto.email;
    user.username = createUserDto.username;
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

      return await this.userRepository.save(user);
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

  async updateUser(id: number, updateUserDto: UpdateUserDto) {
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

  async deleteUser(id: number) {
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

  private async hashPassword(password: string) {
    const salt = await bcrypt.genSalt(HASH_SALT_ROUNDS);
    return await bcrypt.hash(password, salt);
  }
}
