import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { PermissionEnum } from './roles/permission.enum';
import { RequirePermissions } from './roles/require-permissions.decorator';

@Controller()
export class AppController {
  // constructor() {}

  @Get('protected')
  @RequirePermissions(PermissionEnum.POST_APPROVE)
  getHello(@Request() req) {
    return req.user;
  }
}
