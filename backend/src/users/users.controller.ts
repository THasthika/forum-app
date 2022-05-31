import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { Public } from 'src/public.decorator';
import { PermissionEnum } from 'src/roles/permission.enum';
import { RequirePermissions } from 'src/roles/require-permissions.decorator';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  @RequirePermissions(PermissionEnum.USER_READ)
  findAllUsers() {
    return this.usersService.findAllUsers();
  }

  @Get(':id')
  @RequirePermissions(PermissionEnum.USER_READ)
  findUserById(@Param('id') id: number) {
    return this.usersService.findUserById(id, { relations: ['roles'] });
  }

  @Post()
  @Public()
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createUser(createUserDto);
  }

  @Patch(':id')
  updateUser(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.updateUser(id, updateUserDto);
  }

  @Delete(':id')
  deleteUser(@Param('id') id: number) {
    return this.usersService.deleteUser(id);
  }

  // manage roles
  @Post(':id/role/:roleName')
  @RequirePermissions(PermissionEnum.USER_ROLE_UPDATE)
  addRole(@Param('id') id: number, @Param('roleName') roleName: string) {
    return this.usersService.addRole(id, roleName);
  }

  @Delete(':id/role/:roleName')
  @RequirePermissions(PermissionEnum.USER_ROLE_UPDATE)
  removeRole(@Param('id') id: number, @Param('roleName') roleName: string) {
    return this.usersService.removeRole(id, roleName);
  }
}
