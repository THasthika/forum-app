import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostEntity } from './post.entity';
import { PostsService } from './posts.service';

@Module({
  providers: [PostsService],
  imports: [TypeOrmModule.forFeature([PostEntity])],
})
export class PostsModule {}
