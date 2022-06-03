import { Column, Entity, ManyToMany } from 'typeorm';
import { RoleEntity } from './role.entity';

@Entity({ name: 'permissions' })
export class Permission {
  @Column({ primary: true })
  name: string;

  @ManyToMany(() => RoleEntity, (role) => role.permissions)
  roles: RoleEntity[];
}
