import { Transform } from 'class-transformer';
import { Role } from '../../roles/role.entity';

export class User {
  id: number;
  email: string;
  username: string;
  isBanned: boolean;
  isVerified: boolean;
  @Transform(({ value }) =>
    value.map((v: Role) => ({ name: v.name, displayName: v.displayName })),
  )
  roles: Role[];
}
