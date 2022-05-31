import { Exclude, Expose, Transform } from 'class-transformer';
import { Role } from '../roles/role.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column({ unique: true })
  username: string;

  @Column()
  @Exclude()
  password: string;

  @Column({ default: false })
  isBanned: boolean;

  @Column({ default: false })
  isVerified: boolean;

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
