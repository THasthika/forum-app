import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityNotFoundError, Repository } from 'typeorm';
import { CommentNotFoundException } from './exceptions/comment-not-found.exception';
import { paginate, PaginateQuery } from 'nestjs-paginate';
import { CommentEntity } from './comment.entity';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { IIsOwnerService } from 'src/common/interfaces/is-owner-service.interface';

@Injectable()
export class CommentsService implements IIsOwnerService {
  constructor(
    @InjectRepository(CommentEntity)
    private commentRepository: Repository<CommentEntity>,
  ) {}

  async createComment(dto: CreateCommentDto) {
    try {
      const comment = this.commentRepository.create(dto);
      return await this.commentRepository.save(comment);
    } catch (err) {
      throw err;
    }
  }

  async updateComment(id: string, dto: UpdateCommentDto) {
    try {
      const comment = await this.commentRepository.findOneOrFail(id);
      if (!!dto.content) {
        comment.content = dto.content;
      }
      return this.commentRepository.save(comment);
    } catch (err) {
      if (err instanceof EntityNotFoundError) {
        throw new CommentNotFoundException();
      }
      throw err;
    }
  }

  async findCommentsByPostId(postId: string, query: PaginateQuery) {
    return paginate(query, this.commentRepository, {
      sortableColumns: ['createdAt', 'updatedAt'],
      searchableColumns: ['post.id'],
      defaultSortBy: [['updatedAt', 'DESC']],
      defaultLimit: 50,
      where: { postId },
    });
  }

  async deleteComment(id: string) {
    const comment = await this.commentRepository.findOne(id);
    if (!comment) throw new CommentNotFoundException();
    return await this.commentRepository.remove(comment);
  }

  async isOwner(id: string, userId: string) {
    const comment = await this.commentRepository.findOne(id, {
      select: ['authorId'],
    });
    if (!comment) throw new CommentNotFoundException();
    return comment.authorId === userId;
  }
}
