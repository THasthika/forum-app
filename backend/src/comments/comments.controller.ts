import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { Paginate, PaginateQuery } from 'nestjs-paginate';
import { AuthUser } from 'src/auth/auth-user.decorator';
import { IAuthUser } from 'src/auth/interfaces/auth-user.interface';
import { PermissionDeniedExcpetion } from 'src/common/exceptions/permission-denied.exception';
import { isOwnerOrHasPermissions } from 'src/common/helper';
import { PaginateQueryOptions } from 'src/common/paginated-query.decorators';
import { PermissionEnum } from 'src/roles/permission.enum';
import { RequirePermissions } from 'src/roles/require-permissions.decorator';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Controller('comments')
export class CommentsController {
  constructor(private commentsService: CommentsService) {}

  @Post()
  @RequirePermissions(PermissionEnum.COMMENT_CREATE)
  async createComment(
    @AuthUser() authUser: IAuthUser,
    @Body() createCommentDto: CreateCommentDto,
  ) {
    if (authUser.isBanned) {
      throw new PermissionDeniedExcpetion();
    }
    createCommentDto.authorId = authUser.id;
    return await this.commentsService.createComment(createCommentDto);
  }

  // @Get('post/:postId')
  // @PaginateQueryOptions()
  // @RequirePermissions(PermissionEnum.COMMENT_READ)
  // async getPostComments(
  //   @Param('postId', ParseUUIDPipe) postId: string,
  //   @Paginate() query: PaginateQuery,
  // ) {
  //   return await this.commentsService.findCommentsByPostId(postId, query);
  // }

  @Patch(':id')
  async updateComment(
    @AuthUser() authUser: IAuthUser,
    @Param('id', ParseUUIDPipe) commentId: string,
    @Body() updateCommentDto: UpdateCommentDto,
  ) {
    if (authUser.isBanned) {
      throw new PermissionDeniedExcpetion();
    }
    if (
      !(await isOwnerOrHasPermissions(
        this.commentsService,
        commentId,
        authUser,
        PermissionEnum.COMMENT_UPDATE,
      ))
    ) {
      throw new PermissionDeniedExcpetion();
    }
    return await this.commentsService.updateComment(
      commentId,
      updateCommentDto,
    );
  }

  @Delete(':id')
  async deleteComment(
    @AuthUser() authUser: IAuthUser,
    @Param('id', ParseUUIDPipe) commentId: string,
  ) {
    if (authUser.isBanned) {
      throw new PermissionDeniedExcpetion();
    }
    if (
      !(await isOwnerOrHasPermissions(
        this.commentsService,
        commentId,
        authUser,
        PermissionEnum.COMMENT_DELETE,
      ))
    ) {
      throw new PermissionDeniedExcpetion();
    }
    return await this.commentsService.deleteComment(commentId);
  }
}
