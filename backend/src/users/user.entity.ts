import { Exclude, Expose, Transform } from 'class-transformer';
import { Role } from '../roles/role.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'users' })
export class User {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty()
  @Column({ unique: true })
  email: string;

  @ApiProperty()
  @Column({ unique: true })
  username: string;

  @Column()
  @Exclude()
  password: string;

  @ApiProperty()
  @Column({ default: false })
  isBanned: boolean;

  @ApiProperty()
  @Column({ default: false })
  isVerified: boolean;

  @ApiProperty({ isArray: true, type: Role })
  @ManyToMany(() => Role, (role) => role.users)
  @JoinTable({
    name: 'user_roles',
    joinColumn: {
      name: 'users',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'roles',
      referencedColumnName: 'name',
    },
  })
  @Transform(({ value }) =>
    value.map((v: Role) => ({ name: v.name, displayName: v.displayName })),
  )
  roles: Role[];
}
