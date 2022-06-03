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
import {
  ApiPaginatedResponse,
  PaginateQueryOptions,
} from 'src/paginated-query.decorators';
import { Public } from 'src/public.decorator';
import { PermissionEnum } from 'src/roles/permission.enum';
import { RequirePermissions } from 'src/roles/require-permissions.decorator';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './user.entity';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  @RequirePermissions(PermissionEnum.USER_READ)
  @ApiPaginatedResponse({
    model: User,
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
    type: User,
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
    type: User,
    description: 'Creates new user object.',
  })
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createUser(createUserDto);
  }

  @Patch(':id')
  @ApiOkResponse({
    type: User,
    description: 'Updates a given user.',
  })
  updateUser(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.updateUser(id, updateUserDto);
  }

  @Delete(':id')
  @ApiOkResponse({
    type: User,
    description: 'Remove a user.',
  })
  deleteUser(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.deleteUser(id);
  }

  // manage roles
  @Post(':id/role/:roleName')
  @RequirePermissions(PermissionEnum.USER_ROLE_UPDATE)
  @ApiOkResponse({
    type: User,
    description: 'Add a role to user.',
  })
  addRole(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('roleName') roleName: string,
  ) {
    return this.usersService.addRole(id, roleName);
  }

  @Delete(':id/role/:roleName')
  @ApiOkResponse({ type: User, description: 'Remove a role from user.' })
  @RequirePermissions(PermissionEnum.USER_ROLE_UPDATE)
  removeRole(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('roleName') roleName: string,
  ) {
    return this.usersService.removeRole(id, roleName);
  }
}
