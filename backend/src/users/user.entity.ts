import { Exclude, Expose, Transform } from 'class-transformer';
import { RoleEntity } from '../roles/role.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { PostEntity } from 'src/posts/post.entity';
import { CommentEntity } from 'src/posts/comment.entity';

@Entity({ name: 'users' })
export class UserEntity {
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

  @ApiProperty({ isArray: true, type: RoleEntity })
  @ManyToMany(() => RoleEntity, (role) => role.users)
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
    value.map((v: RoleEntity) => ({
      name: v.name,
      displayName: v.displayName,
    })),
  )
  roles: RoleEntity[];

  @OneToMany(() => PostEntity, (post) => post.author)
  authoredPosts: PostEntity[];

  @OneToMany(() => PostEntity, (post) => post.checker)
  checkedPosts: PostEntity[];

  @OneToMany(() => CommentEntity, (comment) => comment.author)
  authoredComments: CommentEntity[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
