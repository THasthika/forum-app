import { ForbiddenException } from '@nestjs/common';

export class PermissionDeniedExcpetion extends ForbiddenException {
  constructor() {
    super('Permission Denied');
  }
}
