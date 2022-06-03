import { Body, Controller, Post, Req } from '@nestjs/common';
import { hasPermission, PermissionEnum } from 'src/roles/permission.enum';
import { RequirePermissions } from 'src/roles/require-permissions.decorator';
import { CreatePostDto } from './dto/create-post.dto';
import { PostsService } from './posts.service';

@Controller('posts')
export class PostsController {
  constructor(private postsService: PostsService) {}

  @Post()
  @RequirePermissions(PermissionEnum.POST_CREATE)
  createPost(@Req() req, @Body() dto: CreatePostDto) {
    const userId = req.user.id;
    dto.authorId = userId;
    return this.postsService.createPost(dto);
  }
}
