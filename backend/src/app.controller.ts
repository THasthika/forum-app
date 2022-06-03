import { Controller, Get, Request } from '@nestjs/common';
import { PermissionEnum } from './roles/permission.enum';
import { RequirePermissions } from './roles/require-permissions.decorator';

@Controller()
export class AppController {
  // constructor() {}

  @Get('protected')
  @RequirePermissions(
    PermissionEnum.POST_STATUS_UPDATE,
    PermissionEnum.POST_CREATE,
  )
  getHello(@Request() req) {
    return req.user;
  }
}
