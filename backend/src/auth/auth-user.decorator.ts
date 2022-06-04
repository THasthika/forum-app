import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { IAuthUser } from './interfaces/auth-user.interface';

export const AuthUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user as IAuthUser;
  },
);
