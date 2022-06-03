import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Permission } from './permission.entity';
import { RoleEntity } from './role.entity';
import { RolesService } from './roles.service';

@Module({
  imports: [TypeOrmModule.forFeature([RoleEntity, Permission])],
  providers: [RolesService],
  exports: [RolesService],
})
export class RolesModule {}
