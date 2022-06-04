import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityNotFoundError, Repository } from 'typeorm';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostNotFoundException } from './exceptions/post-not-found.exception';
import { PostEntity } from './post.entity';
import { paginate, Paginated, PaginateQuery } from 'nestjs-paginate';
@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(PostEntity)
    private postRepository: Repository<PostEntity>,
  ) {}

  async createPost(dto: CreatePostDto) {
    try {
      const post = this.postRepository.create(dto);
      return await this.postRepository.save(post);
    } catch (err) {
      throw err;
    }
  }

  async updatePost(id: string, dto: UpdatePostDto) {
    try {
      const post = await this.postRepository.findOneOrFail(id);
      if (!!dto.content) {
        post.content = dto.content;
      }
      if (!!dto.title) {
        post.title = dto.title;
      }
      return this.postRepository.save(post);
    } catch (err) {
      if (err instanceof EntityNotFoundError) {
        throw new PostNotFoundException();
      }
      throw err;
    }
  }

  async findPostById(id: string) {
    try {
      return await this.postRepository.findOneOrFail(id);
    } catch (err) {
      if (err instanceof EntityNotFoundError) {
        throw new PostNotFoundException();
      }
      throw err;
    }
  }

  findAllPosts(query: PaginateQuery): Promise<Paginated<PostEntity>> {
    return paginate(query, this.postRepository, {
      sortableColumns: [
        'id',
        'title',
        'author',
        'checker',
        'createdAt',
        'updatedAt',
      ],
      searchableColumns: ['id', 'title', 'content', 'author', 'checker'],
      defaultSortBy: [['updatedAt', 'DESC']],
      defaultLimit: 50,
    });
  }

  async deletePost(id: string) {
    try {
      const post = await this.findPostById(id);
      return await this.postRepository.remove(post);
    } catch (err) {
      throw err;
    }
  }

  async isOwner(id: string, userId: string) {
    const post = await this.postRepository.findOne(id, {
      select: ['authorId'],
    });
    if (!post) throw new PostNotFoundException();
    return post.authorId === userId;
  }
}
