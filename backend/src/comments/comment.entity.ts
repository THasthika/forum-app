import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { UserEntity } from '../users/user.entity';
import { PostEntity } from '../posts/post.entity';

@Entity({ name: 'comments' })
export class CommentEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  postId: string;

  @ApiProperty()
  @ManyToOne(() => PostEntity, (post) => post.comments, { primary: true })
  post: PostEntity;

  @ApiProperty()
  @Column({ type: 'text' })
  content: string;

  @Column()
  authorId: string;

  @ApiProperty()
  @ManyToOne(() => UserEntity, (user) => user.authoredComments)
  author: UserEntity;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
