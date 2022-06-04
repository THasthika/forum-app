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
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiResponse,
} from '@nestjs/swagger';
import { Paginate, PaginateQuery } from 'nestjs-paginate';
import { PermissionDeniedExcpetion } from 'src/common/exceptions/permission-denied.exception';
import { isOwnerOrHasPermissions } from 'src/common/helper';
import { AuthUser } from '../auth/auth-user.decorator';
import { IAuthUser } from '../auth/interfaces/auth-user.interface';
import {
  ApiPaginatedResponse,
  PaginateQueryOptions,
} from '../common/paginated-query.decorators';
import { Public } from '../common/public.decorator';
import { PermissionEnum } from '../roles/permission.enum';
import { RequirePermissions } from '../roles/require-permissions.decorator';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './user.entity';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  @RequirePermissions(PermissionEnum.USER_READ)
  @ApiPaginatedResponse({
    model: UserEntity,
    description: 'Get paginated user data.',
  })
  @PaginateQueryOptions()
  findAllUsers(@Paginate() query: PaginateQuery) {
    return this.usersService.findAllUsers(query);
  }

  @Get(':id')
  @RequirePermissions(PermissionEnum.USER_READ)
  @ApiResponse({
    status: 200,
    type: UserEntity,
    description: 'Get user by id.',
  })
  findUserById(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.findUserById(id, {
      relations: ['roles'],
    });
  }

  @Post()
  @Public()
  @ApiCreatedResponse({
    type: UserEntity,
    description: 'Creates new user object.',
  })
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createUser(createUserDto);
  }

  @Patch(':id')
  @ApiOkResponse({
    type: UserEntity,
    description: 'Updates a given user.',
  })
  async updateUser(
    @AuthUser() authUser: IAuthUser,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    // check permissions
    if (
      !(await isOwnerOrHasPermissions(
        this.usersService,
        id,
        authUser,
        PermissionEnum.POST_DELETE,
      ))
    ) {
      throw new PermissionDeniedExcpetion();
    }
    return this.usersService.updateUser(id, updateUserDto);
  }

  @Delete(':id')
  @RequirePermissions(PermissionEnum.USER_DELETE)
  @ApiOkResponse({
    type: UserEntity,
    description: 'Remove a user.',
  })
  deleteUser(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.deleteUser(id);
  }

  // manage roles
  @Post(':id/role/:roleName')
  @RequirePermissions(PermissionEnum.USER_ROLE_UPDATE)
  @ApiOkResponse({
    type: UserEntity,
    description: 'Add a role to user.',
  })
  addRole(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('roleName') roleName: string,
  ) {
    return this.usersService.addRole(id, roleName);
  }

  @Delete(':id/role/:roleName')
  @ApiOkResponse({ type: UserEntity, description: 'Remove a role from user.' })
  @RequirePermissions(PermissionEnum.USER_ROLE_UPDATE)
  removeRole(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('roleName') roleName: string,
  ) {
    return this.usersService.removeRole(id, roleName);
  }
}
