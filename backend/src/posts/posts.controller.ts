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
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostsService } from './posts.service';

@Controller('posts')
export class PostsController {
  constructor(private postsService: PostsService) {}

  @Post()
  @RequirePermissions(PermissionEnum.POST_CREATE)
  createPost(@AuthUser() authUser: IAuthUser, @Body() dto: CreatePostDto) {
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
    // check permissions
    if (
      !(await isOwnerOrHasPermissions(
        this.postsService.isOwner,
        id,
        authUser,
        PermissionEnum.POST_UPDATE,
      ))
    ) {
      throw new PermissionDeniedExcpetion();
    }
    return this.postsService.updatePost(id, dto);
  }

  @Delete(':id')
  async deletePostById(
    @AuthUser() authUser: IAuthUser,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    // check permissions
    if (
      !(await isOwnerOrHasPermissions(
        this.postsService.isOwner,
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
