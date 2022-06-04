import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostEntity } from './post.entity';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { CommentsModule } from 'src/comments/comments.module';

@Module({
  providers: [PostsService],
  imports: [TypeOrmModule.forFeature([PostEntity]), CommentsModule],
  controllers: [PostsController],
})
export class PostsModule {}
