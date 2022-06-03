import {
  Controller,
  Post,
  UseGuards,
  Request,
  HttpCode,
  Body,
} from '@nestjs/common';
import { ApiBody } from '@nestjs/swagger';
import { Public } from '../public.decorator';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { LocalAuthGuard } from './local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @HttpCode(200)
  @UseGuards(LocalAuthGuard)
  @Public()
  @ApiBody({ type: LoginDto })
  async login(@Request() req) {
    return await this.authService.login(req.user);
  }

  @Post('refresh')
  @HttpCode(200)
  @Public()
  refresh(@Body() dto: RefreshTokenDto) {
    return this.authService.refreshAccessToken(dto);
  }
}
