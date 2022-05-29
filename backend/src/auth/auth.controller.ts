import { Controller, Post, UseGuards, Request, Body } from '@nestjs/common';
import { Public } from '../public.decorator';
import { AuthService } from './auth.service';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { LocalAuthGuard } from './local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @UseGuards(LocalAuthGuard)
  @Public()
  login(@Request() req) {
    return this.authService.login(req.user);
  }

  @Post('refresh')
  @Public()
  refresh(@Body() dto: RefreshTokenDto) {
    return this.authService.refreshAccessToken(dto);
  }
}
