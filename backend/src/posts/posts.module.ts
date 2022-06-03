import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostEntity } from './post.entity';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';

@Module({
  providers: [PostsService],
  imports: [TypeOrmModule.forFeature([PostEntity])],
  controllers: [PostsController],
})
export class PostsModule {}
