import { UserEntity } from '../users/user.entity';
import { Column, Entity, JoinTable, ManyToMany } from 'typeorm';
import { Permission } from './permission.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'roles' })
export class RoleEntity {
  @ApiProperty()
  @Column({ primary: true })
  name: string;

  @ApiProperty()
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

  @ManyToMany(() => UserEntity, (user) => user.roles)
  users: UserEntity[];
}
