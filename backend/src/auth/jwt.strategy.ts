import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JWT_SECRET } from 'src/config/common';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: JWT_SECRET,
      ignoreExpiration: false,
    });
  }

  async validate(payload: any) {
    // fetch user
    const user = await this.usersService.findUserById(payload.sub, {
      relations: ['roles', 'roles.permissions'],
    });
    if (!user) {
      return null;
    }
    const permissions = new Set<string>();
    user.roles.forEach((role) => {
      role.permissions.forEach((perm) => {
        permissions.add(perm.name);
      });
    });
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      permissions: Array.from(permissions.values()),
    };
  }
}
