import { SetMetadata } from '@nestjs/common';
import { PermissionEnum } from './permission.enum';

export const REQUIRED_PERMISSIONS_KEY = 'permissions';
export const RequirePermissions = (...permissions: PermissionEnum[]) =>
  SetMetadata(REQUIRED_PERMISSIONS_KEY, permissions);
