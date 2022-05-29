import { User } from '../users/user.entity';
import { Column, Entity, JoinTable, ManyToMany } from 'typeorm';
import { Permission } from './permission.entity';

@Entity({ name: 'roles' })
export class Role {
  @Column({ primary: true })
  name: string;

  @Column({ unique: true })
  displayName: string;

  @ManyToMany(() => Permission, (permission) => permission.roles)
  @JoinTable({
    name: 'role_permissions',
    joinColumn: {
      name: 'roles',
      referencedColumnName: 'name',
    },
    inverseJoinColumn: {
      name: 'permissions',
      referencedColumnName: 'name',
    },
  })
  permissions: Permission[];

  @ManyToMany(() => User, (user) => user.roles)
  users: User[];
}
