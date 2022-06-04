import { IAuthUser } from 'src/auth/interfaces/auth-user.interface';
import { hasPermission, PermissionEnum } from 'src/roles/permission.enum';
import { IIsOwnerService } from './interfaces/is-owner-service.interface';

// export function createOwnershipOrPermissionCheckFunction(
//   checkOwnerFn: (id: string, userId: string) => Promise<boolean>,
// ) {
//   const fn = async (
//     id: string,
//     authUser: IAuthUser,
//     ...permissions: PermissionEnum[]
//   ) => {
//     return (
//       (await checkOwnerFn(id, authUser.id)) ||
//       hasPermission(authUser.permissions, ...permissions)
//     );
//   };
//   return fn;
// }

export async function isOwnerOrHasPermissions(
  service: IIsOwnerService,
  id: string,
  authUser: IAuthUser,
  ...permissions: PermissionEnum[]
) {
  if (
    !(await service.isOwner(id, authUser.id)) &&
    !hasPermission(authUser.permissions, ...permissions)
  ) {
    return false;
  }
  return true;
}
