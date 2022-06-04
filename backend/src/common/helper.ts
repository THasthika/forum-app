import { IAuthUser } from 'src/auth/interfaces/auth-user.interface';
import { hasPermission, PermissionEnum } from 'src/roles/permission.enum';

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
  checkOwnerFn: (id: string, userId: string) => Promise<boolean>,
  id: string,
  authUser: IAuthUser,
  ...permissions: PermissionEnum[]
) {
  if (
    !(await checkOwnerFn(id, authUser.id)) &&
    !hasPermission(authUser.permissions, ...permissions)
  ) {
    return false;
  }
  return true;
}
