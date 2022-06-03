import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { UserEntity } from '../users/user.entity';

@Entity({ name: 'posts' })
export class PostEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty()
  @Column()
  title: string;

  @ApiProperty()
  @Column({ type: 'text' })
  content: string;

  @ApiProperty()
  @Column({ default: false })
  published: boolean;

  @ApiProperty()
  @ManyToOne(() => UserEntity, { nullable: true })
  approvedBy?: UserEntity;

  @ApiProperty()
  @ManyToOne(() => UserEntity)
  author: UserEntity;

  // @ApiProperty()
  // @PrimaryGeneratedColumn()
  // id: number;

  // @ApiProperty()
  // @Column({ unique: true })
  // email: string;

  // @ApiProperty()
  // @Column({ unique: true })
  // username: string;

  // @Column()
  // @Exclude()
  // password: string;

  // @ApiProperty()
  // @Column({ default: false })
  // isBanned: boolean;

  // @ApiProperty()
  // @Column({ default: false })
  // isVerified: boolean;

  // @ApiProperty({ isArray: true, type: RoleEntity })
  // @ManyToMany(() => RoleEntity, (role) => role.users)
  // @JoinTable({
  //   name: 'user_roles',
  //   joinColumn: {
  //     name: 'users',
  //     referencedColumnName: 'id',
  //   },
  //   inverseJoinColumn: {
  //     name: 'roles',
  //     referencedColumnName: 'name',
  //   },
  // })
  // @Transform(({ value }) =>
  //   value.map((v: RoleEntity) => ({ name: v.name, displayName: v.displayName })),
  // )
  // roles: RoleEntity[];
}
