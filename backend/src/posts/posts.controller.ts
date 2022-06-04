import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseEnumPipe,
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
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostStatusDto } from './dto/update-post-status.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostStatus } from './post.entity';
import { PostsService } from './posts.service';

@Controller('posts')
export class PostsController {
  constructor(private postsService: PostsService) {}

  @Post()
  @RequirePermissions(PermissionEnum.POST_CREATE)
  createPost(@AuthUser() authUser: IAuthUser, @Body() dto: CreatePostDto) {
    if (authUser.isBanned) {
      throw new PermissionDeniedExcpetion();
    }
    dto.authorId = authUser.id;
    return this.postsService.createPost(dto);
  }

  @Get()
  @PaginateQueryOptions()
  @RequirePermissions(PermissionEnum.POST_READ)
  findAllUsers(@Paginate() query: PaginateQuery) {
    return this.postsService.findAllPosts(query);
  }

  @Get(':id')
  @RequirePermissions(PermissionEnum.POST_READ)
  findPostById(@Param('id', ParseUUIDPipe) id: string) {
    return this.postsService.findPostById(id);
  }

  @Patch(':id')
  async updatePost(
    @AuthUser() authUser: IAuthUser,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdatePostDto,
  ) {
    if (authUser.isBanned) {
      throw new PermissionDeniedExcpetion();
    }
    // check permissions
    if (
      !(await isOwnerOrHasPermissions(
        this.postsService,
        id,
        authUser,
        PermissionEnum.POST_UPDATE,
      ))
    ) {
      throw new PermissionDeniedExcpetion();
    }
    return this.postsService.updatePost(id, dto);
  }

  @Patch(':id/approve')
  @RequirePermissions(PermissionEnum.POST_STATUS_UPDATE)
  async approvePost(
    @AuthUser() authUser: IAuthUser,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    const dto = new UpdatePostStatusDto();
    dto.id = id;
    dto.status = PostStatus.APPROVED;
    dto.checkerId = authUser.id;
    return await this.postsService.updatePostStatus(dto);
  }

  @Patch(':id/reject')
  @RequirePermissions(PermissionEnum.POST_STATUS_UPDATE)
  async rejectPost(
    @AuthUser() authUser: IAuthUser,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    const dto = new UpdatePostStatusDto();
    dto.id = id;
    dto.status = PostStatus.REJECTED;
    dto.checkerId = authUser.id;
    return await this.postsService.updatePostStatus(dto);
  }

  @Delete(':id')
  async deletePostById(
    @AuthUser() authUser: IAuthUser,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    // check banned
    if (authUser.isBanned) {
      throw new PermissionDeniedExcpetion();
    }
    // check permissions
    if (
      !(await isOwnerOrHasPermissions(
        this.postsService,
        id,
        authUser,
        PermissionEnum.POST_DELETE,
      ))
    ) {
      throw new PermissionDeniedExcpetion();
    }
    return this.postsService.deletePost(id);
  }
}
