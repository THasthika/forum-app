import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PermissionEnum } from './permission.enum';
import { Repository } from 'typeorm';
import { Permission } from './permission.entity';
import { RoleEntity } from './role.entity';

@Injectable()
export class RolesService implements OnModuleInit {
  private logger = new Logger(RolesService.name);

  constructor(
    @InjectRepository(RoleEntity)
    private roleRepository: Repository<RoleEntity>,
    @InjectRepository(Permission)
    private permissionRepository: Repository<Permission>,
  ) {}

  async onModuleInit() {
    await this.initPermissions();
    await this.initRoles();
  }

  private async initPermissions() {
    // add permissions which are not in the database
    this.logger.log('Updating permissions table to add missing permissions...');

    const permissionsInDB = await this.permissionRepository.find();

    const permissionsInSystem = Object.values(PermissionEnum);

    const permissionsNeedToBeAdded = permissionsInSystem.filter((ps) => {
      return !permissionsInDB.some((pd) => pd.name === ps);
    });

    const permissionsNeedToBeRemoved = permissionsInDB.filter((pd) => {
      return !permissionsInSystem.some((ps) => pd.name === ps);
    });

    this.logger.log(
      `Permissions to be added: ${permissionsNeedToBeAdded.length}`,
    );
    this.logger.log(
      `Permissions to be removed: ${permissionsNeedToBeRemoved.length}`,
    );

    this.permissionRepository.remove(permissionsNeedToBeRemoved);

    const permissionEntities = permissionsNeedToBeAdded.map((v) =>
      this.permissionRepository.create({ name: v }),
    );

    this.permissionRepository.save(permissionEntities);
  }

  private async initRoles() {
    this.createRoleWithPermissions(
      'ADMIN',
      'Admin',
      Object.values(PermissionEnum).map((v) => v.toString()),
    );
    this.createRoleWithPermissions('USER', 'User', [
      PermissionEnum.USER_READ,
      PermissionEnum.POST_CREATE,
      PermissionEnum.POST_READ,
      PermissionEnum.COMMENT_CREATE,
      PermissionEnum.COMMENT_READ,
    ]);
  }

  private async createRoleWithPermissions(
    roleName: string,
    roleDisplayName: string,
    permissions: string[] = [],
  ) {
    this.logger.log(`Creating/Updating role ${roleName}`);
    let role = await this.roleRepository.findOne({
      name: roleName,
    });
    if (!role) {
      role = this.roleRepository.create({
        name: roleName,
        displayName: roleDisplayName,
      });
    }
    role.permissions = permissions.map((v) =>
      this.permissionRepository.create({ name: v }),
    );
    this.roleRepository.save(role);
  }

  async findRoleByName(name: string) {
    return this.roleRepository.findOne({ name });
  }
}
