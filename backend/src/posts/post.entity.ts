import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { UserEntity } from '../users/user.entity';
import { CommentEntity } from '../comments/comment.entity';

export enum PostStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  DELETED = 'deleted',
}

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
  @Column({ type: 'enum', enum: PostStatus, default: PostStatus.PENDING })
  status: PostStatus;

  @OneToMany(() => CommentEntity, (comment) => comment.post)
  comments: CommentEntity[];

  @Column({ nullable: true })
  checkerId: string;

  @ApiProperty()
  @ManyToOne(() => UserEntity, (user) => user.checkedPosts, { nullable: true })
  checker?: UserEntity;

  @Column()
  authorId: string;

  @ApiProperty()
  @ManyToOne(() => UserEntity, (user) => user.authoredPosts)
  author: UserEntity;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
