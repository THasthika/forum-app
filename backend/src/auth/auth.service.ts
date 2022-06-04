import {
  HttpException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';

import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { EntityNotFoundError, Raw, Repository } from 'typeorm';
import { UsersService } from '../users/users.service';
import { RefreshTokenEntity } from './refresh-token.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { add } from 'date-fns';
import { REFRESH_TOKEN_EXPIRY } from '../common/config/common';
import { Cron } from '@nestjs/schedule';
import { RefreshTokenDto } from './dto/refresh-token.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    @InjectRepository(RefreshTokenEntity)
    private refreshTokenRepository: Repository<RefreshTokenEntity>,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findUserByEmail(email);
    if (!user) {
      return null;
    }
    if (!(await this.comparePassword(password, user.password))) {
      return null;
    }
    if (!user.isVerified) {
      return null;
    }
    return user;
  }

  async login(user: any) {
    const payload = { username: user.username, sub: user.id };

    // create refresh token
    const refreshToken = await this.createRefreshToken(user.id);

    return {
      accessToken: this.jwtService.sign(payload),
      refreshToken: refreshToken,
      email: user.email,
      username: user.username,
      id: user.id,
    };
  }

  async refreshAccessToken(refreshTokenDto: RefreshTokenDto) {
    try {
      const decoded = this.jwtService.decode(refreshTokenDto.refreshToken);
      const token = decoded['token'];
      const userId = decoded['userId'];
      const refreshTokenEntry = await this.refreshTokenRepository.findOneOrFail(
        {
          token,
          userId,
        },
      );
      this.refreshTokenRepository.remove(refreshTokenEntry);
      const user = await this.usersService.findUserById(userId);
      return this.login(user);
    } catch (err) {
      if (err instanceof HttpException) {
        throw err;
      }
      if (err instanceof EntityNotFoundError) {
        throw new UnauthorizedException();
      }
      throw err;
    }
  }

  @Cron('0 */15 * * * *')
  async handleExpiredRefreshTokens() {
    this.logger.log('Removing expired refresh tokens...');

    const res = await this.refreshTokenRepository.delete({
      expiry: Raw((alias) => `${alias} <= NOW()`),
    });

    this.logger.log(`Refresh Tokens Removed: ${res.affected}`);
  }

  private async comparePassword(password: string, hash: string) {
    return await bcrypt.compare(password, hash);
  }

  private makeid(length: number) {
    let result = '';
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  private async createRefreshToken(id: string): Promise<string> {
    const token = this.makeid(64);
    const expiry = add(new Date(), { seconds: REFRESH_TOKEN_EXPIRY });
    const refreshToken = this.refreshTokenRepository.create({
      userId: id,
      token,
      expiry,
    });
    await this.refreshTokenRepository.save(refreshToken);
    const refreshTokenString = this.jwtService.sign(
      { userId: id, token },
      { expiresIn: REFRESH_TOKEN_EXPIRY },
    );
    return refreshTokenString;
  }
}
