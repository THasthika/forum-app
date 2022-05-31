import { Controller, Post, UseGuards, Request, Body } from '@nestjs/common';
import { Public } from '../public.decorator';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { LocalAuthGuard } from './local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @UseGuards(LocalAuthGuard)
  @Public()
  async login(@Request() req, @Body() _: LoginDto) {
    return await this.authService.login(req.user);
  }
}
